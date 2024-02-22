import ProcessPayment from '../../../src/app/usecase/ProcessPayment';
import PaymentGateway from '../../../src/infra/gateway/PaymentGateway';
import PaymentGatewayRede from '../../../src/infra/gateway/PaymentGatewayRede';

describe('testes para caso de uso de ProcessPayment', () => {
  let usecase: ProcessPayment;
  let paymentGateway: PaymentGateway;

  beforeEach(() => {
    paymentGateway = new PaymentGatewayRede();
    usecase = new ProcessPayment(paymentGateway);
  });

  test('deve retornar success caso o pagamento seja processado', async () => {
    const input = {
      rideId: 'rideId',
      creditCardToken: 'creditCardToken',
      amount: 1000,
    };
    const output = await usecase.execute(input);
    await expect(output).toBeUndefined();
  });
});