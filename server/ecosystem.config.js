module.exports = {
  apps: [{
    name: 'mantap-api',
    script: './server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    // Default environment is production for deployment
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    // Development environment (use: pm2 start ecosystem.config.js --env development)
    env_development: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    // Restart on failure
    min_uptime: '10s',
    max_restarts: 5,
    // Graceful shutdown
    kill_timeout: 5000,
    listen_timeout: 10000
  }]
};
