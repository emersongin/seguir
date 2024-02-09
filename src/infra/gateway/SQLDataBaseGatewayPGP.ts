import pgp from 'pg-promise';
import SQLDataBaseGateway from './SQLDataBaseGateway';

export default class SQLDataBaseGatewayPGP implements SQLDataBaseGateway {
  private connection: any;

  async connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.connection = pgp()("postgres://postgres:postgres@localhost:5432/app");
      resolve(true);
    });
  }

  async disconnect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.connection.$pool.end();
      resolve(true);
    });
  }

  async query(sql: string, params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, params).then((result: any) => {
        resolve(result);
      });
    });
  }
}