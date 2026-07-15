module.exports = {
  apps: [
    {
      name: 'zerodolg-backend',
      script: './server/entry.mjs',
      cwd: '/var/www/zerodolg.ru',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: 4321,
      },
      env_file: './.env',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,

      // --- Memory & Resource Limits (optimized for 1GB RAM) ---
      // Auto-restart if memory exceeds 400MB (leaves room for OS + swap)
      max_memory_restart: '400M',

      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 8000,
      shutdown_with_message: true,

      // --- Log Rotation (pm2-logrotate) ---
      max_size: '5M', // Rotate log when it reaches 5MB
      max_files: '5', // Keep only 5 rotated log files
      compress: true, // Compress old logs
      date_format: 'YYYY-MM-DD_HH-mm-ss',

      // --- Stability ---
      restart_delay: 3000, // Delay before restart on crash
      exp_backoff_restart_delay: 100, // Exponential backoff
      max_restarts: 20, // Max restarts before giving up
      min_uptime: '10s', // Min uptime to count as stable
      cron_restart: '0 4 * * 0', // Weekly restart at 4AM Sunday to clear memory

      // --- Performance ---
      force: true,
      wait_ready: true,

      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
