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

