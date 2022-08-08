const cron = require('node-cron');
const { interactionMessageService } = require('.');

const initCronJob = async () => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await delay(2000);

  cron
    .schedule('0 1 * * *', async () => {
      console.log('START CRON : ', Date.now());
      const firstMessage = await interactionMessageService.interactionFirstMessage();
      console.log('END CRON : ', Date.now());
    })
    .start();
};

module.exports = {
  initCronJob,
};
