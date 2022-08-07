const proxy = require('http-proxy-middleware');

const router = {
  '/callApi': 'https://gate.dev.tripi.vn',
};

module.exports = function(app) {
  app.use(
    proxy('/callApi/', {
      target: 'https://gate.dev.tripi.vn',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/callApi': '/',
      },
      router,
      logLevel: 'debug',
    }),
  );
};
