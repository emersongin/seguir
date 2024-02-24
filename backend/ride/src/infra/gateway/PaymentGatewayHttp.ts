import axios from 'axios';
import PaymentGateway from './PaymentGateway';
import AccountGateway, { ProcessPaymentInputDto, GetRideTransactionOutputDto } from './PaymentGateway';

axios.defaults.validateStatus = function () {
	return true;
}

export default class PaymentGatewayHttp implements PaymentGateway {
  async processPayment(input: ProcessPaymentInputDto): Promise<void> {
    const response = await axios.post('http://localhost:3002/process_payment', input);
    if (response.status === 422) throw new Error('Payment failed');
  }
  
  async getRideTransaction(rideId: string): Promise<GetRideTransactionOutputDto | undefined> {
    const response = await axios.get(`http://localhost:3002/transaction/${rideId}`);
    if (response.status === 422) return;
    const transaction = response.data;
    return {
      id: transaction.id,
      status: transaction.status
    };
  }
}