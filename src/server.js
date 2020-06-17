const app = require('./app');

const logger = require('./config/logger');

app.listen(3333, () => {
  logger.log('info', '🚀️ Server is running!');
});
