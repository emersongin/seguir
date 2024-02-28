import PaymentGateway from './PaymentGateway';
import AccountGateway, { ProcessPaymentInputDto, GetRideTransactionOutputDto } from './PaymentGateway';
import HttpClient from '../http/httpClient';

export default class PaymentGatewayHttp implements PaymentGateway {
  constructor (readonly httpClient: HttpClient) {}

  async processPayment(input: ProcessPaymentInputDto): Promise<void> {
    const response = await this.httpClient.post('http://localhost:3002/process_payment', input);
    return response;
  }
  
  async getRideTransaction(rideId: string): Promise<GetRideTransactionOutputDto | undefined> {
    const response = await this.httpClient.get(`http://localhost:3002/transaction/${rideId}`);
    if (!response) return;
    return {
      id: response.id,
      status: response.status
    };
  }
}