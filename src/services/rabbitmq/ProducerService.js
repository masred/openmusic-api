// eslint-disable-next-line import/no-extraneous-dependencies
const amqplib = require('amqplib');

const ProducerService = {
  sendMessage: async (queue, msg) => {
    const connection = await amqplib.connect(process.env.RABBITMQ_SERVER);
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
