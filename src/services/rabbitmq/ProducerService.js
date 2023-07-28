// eslint-disable-next-line import/no-extraneous-dependencies
const amqplib = require('amqplib');
const config = require('../../utils/config');

const ProducerService = {
  sendMessage: async (queue, msg) => {
    const connection = await amqplib.connect(config.rabbitMq.server);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, {
      durable: true,
    });

    channel.sendToQueue(queue, Buffer.from(msg));

    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

module.exports = ProducerService;
