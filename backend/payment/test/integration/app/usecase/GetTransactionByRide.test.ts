import crypto from 'crypto';
import Transaction from '../../../../src/domain/Trasaction';
import GetTransactionByRide from '../../../../src/app/usecase/GetTransactionByRide';
import SQLDataBaseGateway from '../../../../../account/src/infra/gateway/SQLDataBaseGateway';
import SQLDataBaseGatewayPGP from '../../../../../account/src/infra/gateway/SQLDataBaseGatewayPGP';
import TransactionRepository from '../../../../src/infra/repository/TransactionRepository';
import TransactionRepositoryDatabase from '../../../../src/infra/repository/TransactionRepositoryDatabase';

describe('testes para caso de uso de pegar uma trasação', () => {
  let database: SQLDataBaseGateway;
  let transactionRepository: TransactionRepository;
  let usecase: GetTransactionByRide;
  let transactionData: {
    rideId: string;
  }

  beforeAll(async () => {
    database = new SQLDataBaseGatewayPGP();
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
    usecase = new GetTransactionByRide(transactionRepository);
    transactionData = {
      rideId
    };
  });

  it('deve retornar uma trasação', async () => {
    const transaction = await usecase.execute(transactionData.rideId);
    expect(transaction).toBeTruthy();
  });
});