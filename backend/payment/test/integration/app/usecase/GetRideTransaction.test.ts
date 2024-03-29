import crypto from 'crypto';
import Transaction from '../../../../src/domain/Trasaction';
import GetRideTransaction from '../../../../src/app/usecase/GetRideTransaction';
import DatabaseConnection from '../../../../src/infra/database/DatabaseConnection';
import PgPromiseAdapter from '../../../../src/infra/database/PgPromiseAdapter';
import TransactionRepository from '../../../../src/infra/repository/TransactionRepository';
import TransactionRepositoryDatabase from '../../../../src/infra/repository/TransactionRepositoryDatabase';

describe('testes para caso de uso de pegar uma trasação', () => {
  let database: DatabaseConnection;
  let transactionRepository: TransactionRepository;
  let usecase: GetRideTransaction;
  let transactionData: {
    rideId: string;
  }

  beforeAll(async () => {
    database = new PgPromiseAdapter();
    await database.connect();
  });

  afterAll(async () => {
    await database.disconnect();
  });

  beforeEach(async () => {
    transactionRepository = new TransactionRepositoryDatabase(database);
    const rideId = crypto.randomUUID();
    await transactionRepository.save(Transaction.create(
      rideId, 
      1000
    ));
    usecase = new GetRideTransaction(transactionRepository);
    transactionData = {
      rideId
    };
  });

  it('deve retornar uma trasação', async () => {
    const transaction = await usecase.execute(transactionData.rideId);
    expect(transaction).toBeTruthy();
  });
});