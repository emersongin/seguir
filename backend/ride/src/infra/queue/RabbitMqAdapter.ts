import amqp from 'amqplib';
import Queue from './Queue';

export default class RabbitMqAdapter implements Queue {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  async connect(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      this.connection = await amqp.connect({
        hostname: 'localhost',
        port: 5672
      });
      this.channel = await this.connection?.createChannel();
      resolve(true);
    });
  }

  async close(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
      resolve(true);
    });
  }
  
  async publish(queue: string, message: any): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await this.channel?.assertQueue(queue, { durable: true });
      this.channel?.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
      resolve(true);
    });
  }

  async consume(queue: string, callback: (message: string) => Promise<void>): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await this.channel?.assertQueue(queue, { durable: true });
      this.channel?.consume(queue, async (message: any) => {
        if (message) {
          const input = JSON.parse(message.content.toString());
          await callback(input);
          this.channel?.ack(message);
        }
      });
      resolve(true);
    });
  }
}