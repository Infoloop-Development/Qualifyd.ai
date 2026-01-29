import express from "express";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, verifyPassword } from "../db";

export const authRouter = express.Router();

export const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const TOKEN_EXPIRY = "7d";

function generateToken(payload: { id: number; email: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): { id: number; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; email: string };
  } catch {
    return null;
  }
}

authRouter.post("/register", (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body || {};

  if (!fullName || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "fullName, email, password and confirmPassword are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Password and confirm password do not match" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long" });
  }

  const normalizedEmail = String(email).toLowerCase().trim();

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalizedEmail)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const existing = findUserByEmail(normalizedEmail);
  if (existing) {
    return res.status(409).json({ error: "User with this email already exists" });
  }

  try {
    const user = createUser(fullName, normalizedEmail, password);
    const token = generateToken({ id: user.id, email: user.email });

    return res.json({
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
      },
    });
  } catch (err: any) {
    // Handle SQLite unique constraint violation (shouldn't happen due to pre-check, but safety net)
    if (err?.code === "SQLITE_CONSTRAINT_UNIQUE" || err?.message?.includes("UNIQUE constraint")) {
      return res.status(409).json({ error: "User with this email already exists" });
    }
    return res.status(500).json({ error: "Failed to create user" });
  }
});

authRouter.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const user = findUserByEmail(normalizedEmail);

  if (!user || !verifyPassword(user, password)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = generateToken({ id: user.id, email: user.email });

  return res.json({
    token,
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
    },
  });
}
);


