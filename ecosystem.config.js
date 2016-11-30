module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    {
      name      : "Avacci-Proxy",
      script    : "./server/app.js",
      instances : 'max',
      exec_mode : 'cluster',
      env: {
        COMMON_VARIABLE: "true"
      },
      env_production : {
        NODE_ENV: "production"
      }
    }
  ]

}
