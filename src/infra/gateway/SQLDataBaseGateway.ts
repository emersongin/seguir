export default interface SQLDataBaseGateway {
  query(sql: string, params: any[] = []): Promise<any>;
  connect(): Promise<boolean>;
  disconnect(): Promise<boolean>;
}