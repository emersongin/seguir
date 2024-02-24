import crypto from 'crypto';
import ProcessPayment from '../../../../src/app/usecase/ProcessPayment';
import PaymentGateway from '../../../../src/infra/gateway/PaymentGateway';
import PaymentGatewayRede from '../../../../src/infra/gateway/PaymentGatewayRede';
import TransactionRepository from '../../../../src/infra/repository/TransactionRepository';
import TransactionRepositoryDatabase from '../../../../src/infra/repository/TransactionRepositoryDatabase';
import SQLDataBaseGateway from '../../../../../account/src/infra/gateway/SQLDataBaseGateway';
import SQLDataBaseGatewayPGP from '../../../../../account/src/infra/gateway/SQLDataBaseGatewayPGP';

describe('testes para caso de uso de ProcessPayment', () => {
  let database: SQLDataBaseGateway;
  let usecase: ProcessPayment;
  let paymentGateway: PaymentGateway;
  let transactionRepository: TransactionRepository;
  let paymentData: {
    rideId: string;
    creditCardToken: string;
    amount: number;
  };

  beforeAll(async () => {
    database = new SQLDataBaseGatewayPGP();
    await database.connect();
  });

  afterAll(async () => {
    await database.disconnect();
  });

  beforeEach(() => {
    paymentGateway = new PaymentGatewayRede();
    transactionRepository = new TransactionRepositoryDatabase(database);
    usecase = new ProcessPayment(paymentGateway, transactionRepository);
    const rideId = crypto.randomUUID();
    paymentData = {
      rideId,
      creditCardToken: 'creditCardToken',
      amount: 1000,
    };
  });

  it('deve retornar success caso o pagamento seja processado', async () => {
    const input = paymentData;
    const output = await usecase.execute(input);
    await expect(output).toBeUndefined();
  });

  it('deve gerar uma transação independente do estado do pagamento', async () => {
    const input = paymentData;
    const output = await usecase.execute(input);
    await expect(output).toBeUndefined();
    const transaction = await transactionRepository.getRideTransaction(paymentData.rideId);
    expect(transaction).toBeDefined();
  });
});