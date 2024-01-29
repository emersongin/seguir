import express, { Express } from 'express';
import SQLAccountDAO from '../../dao/SQLAccountDAO';
import SignupUseCase from '../../../app/usecase/SignupUseCase';
import GetAccountUserCase from '../../../app/usecase/GetAccountUserCase';
import PGPSQLDataBaseGateway from '../../gateway/PGPSQLDataBaseGateway';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/account/:accountId', async (req, res) => {
  const db = new PGPSQLDataBaseGateway();
  db.connect();
  const accountDao = new SQLAccountDAO(db);
  const useCase = new GetAccountUserCase(accountDao);
  const result = await useCase.execute(req.params);
  await db.query('DELETE FROM account', []);
  db.disconnect();
  res.status(200).send(result);
});

app.post('/signup', async (req, res) => {
  const db = new PGPSQLDataBaseGateway();
  db.connect();
  const accountDao = new SQLAccountDAO(db);
  const useCase = new SignupUseCase(accountDao);
  const result = await useCase.execute(req.body);
  db.disconnect();
  res.status(201).send(result);
});

export default app;