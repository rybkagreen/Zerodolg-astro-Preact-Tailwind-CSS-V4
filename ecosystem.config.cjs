module.exports = {
  apps: [
    {
      name: 'zerodolg-backend',
      script: './server/entry.mjs',
      cwd: '/var/www/zerodolg.ru',
      instances: 1, // Start with 1 instance, can scale later
      exec_mode: 'fork', // Using fork mode for better stability
      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: 4321,
      },
      env_file: './.env', // Load .env file from server
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      // Graceful shutdown
      kill_timeout: 3000,
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
