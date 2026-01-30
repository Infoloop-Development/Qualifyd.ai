# Restore Production Environment

## Steps to Restore Production Server

### Step 1: SSH into your production server
```bash
ssh root@your-server-ip
# or
ssh your-username@your-server-ip
```

### Step 2: Navigate to project directory
```bash
cd /var/www/resume-analyzer
```

### Step 3: Pull latest code from Infoloop-Development repo
```bash
git fetch infoloop
git pull infoloop main
```

### Step 4: Restore ecosystem.config.js to original
```bash
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: "resume-analyzer-backend",
      script: "./backend/dist/index.js",
      cwd: "/var/www/resume-analyzer",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
      },
      error_file: "./logs/backend-error.log",
      out_file: "./logs/backend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      max_memory_restart: "500M",
    },
  ],
};
EOF
```

### Step 5: Restore backend/.env to original (SQLite)
```bash
cd backend
nano .env
```

**Remove MongoDB settings, restore to:**
```env
PORT=4000
NODE_ENV=production
JWT_SECRET=t8UXRXICr7uMcF2USudgkeWz6w8Y5bNq25SLjImvdds=
GEMINI_API_KEY=
```

**Remove these lines if they exist:**
- `DB_TYPE=mongodb`
- `MONGODB_URI=...`
- `MONGODB_DB_NAME=...`

Save and exit (`Ctrl+X`, then `Y`, then `Enter`).

### Step 6: Rebuild backend
```bash
cd /var/www/resume-analyzer/backend
npm install
npm run build
```

### Step 7: Restart PM2
```bash
cd /var/www/resume-analyzer
pm2 delete resume-analyzer-backend
pm2 start ecosystem.config.js
pm2 save
```

### Step 8: Verify it's using SQLite
```bash
pm2 logs resume-analyzer-backend --lines 30
```

You should see: `"Using SQLite database"` (or no database message if original code doesn't log it)

### Step 9: Test the application
```bash
curl http://localhost:4000/health
```

Should return: `{"ok":true}`

---

## Quick One-Liner Script

Run this on your production server:

```bash
cd /var/www/resume-analyzer && \
git pull infoloop main && \
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: "resume-analyzer-backend",
      script: "./backend/dist/index.js",
      cwd: "/var/www/resume-analyzer",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
      },
      error_file: "./logs/backend-error.log",
      out_file: "./logs/backend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      max_memory_restart: "500M",
    },
  ],
};
EOF
cd backend && \
sed -i '/^DB_TYPE=/d; /^MONGODB_URI=/d; /^MONGODB_DB_NAME=/d' .env && \
npm install && \
npm run build && \
cd .. && \
pm2 delete resume-analyzer-backend && \
pm2 start ecosystem.config.js && \
pm2 save && \
echo "✅ Production restored to original state!"
```

---

## What Was Changed Back

✅ **ecosystem.config.js** - Removed dotenv and MongoDB env vars
✅ **backend/.env** - Removed MongoDB configuration (back to SQLite)
✅ **Code** - Pulled fresh from Infoloop-Development repo

---

## Verify Everything is Working

1. Check logs show SQLite (or original database):
   ```bash
   pm2 logs resume-analyzer-backend
   ```

2. Test API:
   ```bash
   curl http://localhost:4000/health
   ```

3. Test user registration:
   ```bash
   curl -X POST http://localhost:4000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "fullName": "Test User",
       "email": "test@example.com",
       "password": "password123",
       "confirmPassword": "password123"
     }'
   ```

4. Check SQLite database:
   ```bash
   cd /var/www/resume-analyzer/backend
   sqlite3 data.db "SELECT email, full_name FROM users;"
   ```

---

## Notes

- All MongoDB-related changes have been reverted
- Production is back to using SQLite (original setup)
- Code matches Infoloop-Development repository
- PM2 configuration restored to original
