export default interface DatabaseConnection {
  query(sql: string, params: any[]): Promise<any>;
  connect(): Promise<boolean>;
  disconnect(): Promise<boolean>;
}