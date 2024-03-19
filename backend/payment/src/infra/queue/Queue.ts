export default interface Queue {
  connect(): Promise<boolean>;
  close(): Promise<boolean>;
  publish(queue: string, message: any): Promise<boolean>;
  consume(queue: string, callback: (message: string) => Promise<void>): Promise<boolean>;
}