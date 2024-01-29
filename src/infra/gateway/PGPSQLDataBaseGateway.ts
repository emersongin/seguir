import pgp from 'pg-promise';
import SQLDataBaseGateway from './SQLDataBaseGateway';

export default class PGPSQLDataBaseGateway implements SQLDataBaseGateway {
  _connection: any;

  async connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._connection = pgp()("postgres://postgres:postgres@localhost:5432/app");
      resolve(true);
    });
  }

  async disconnect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._connection.$pool.end();
      resolve(true);
    });
  }

  async query(sql: string, values: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this._connection.query(sql, values).then((result: any) => {
        resolve(result);
      });
    });
  }
}