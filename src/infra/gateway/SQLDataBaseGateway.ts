export default interface SQLDataBaseGateway {
  connect(): Promise<boolean>;
  query(sql: string, values: any[]): Promise<any>;
  disconnect(): Promise<boolean>;
}