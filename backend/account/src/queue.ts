import amqp from 'amqplib';

async function main() {
  try {
    const connection = await amqp.connect({
      hostname: 'localhost',
    });
    if (connection.connection) {
      console.log('Conexão estabelecida com o RabbitMQ.');
    } else {
        console.log('A conexão com o RabbitMQ não foi estabelecida.');
    }
    const channel = await connection.createChannel();
    channel.assertQueue('queue', { durable: true });
    channel.sendToQueue('queue', Buffer.from('{ "name": "Emerson Andrey" }'));
  } catch (error) {
    console.error('Error:', error);
  }
}

main();