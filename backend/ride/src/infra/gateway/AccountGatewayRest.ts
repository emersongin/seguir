import HttpClient from '../http/httpClient';
import AccountGateway, { 
  GetAccountOutputDto, 
  SignupInputDto, 
  SignupOutputDto 
} from './AccountGateway';

export default class AccountGatewayRest implements AccountGateway {
  constructor (readonly httpClient: HttpClient) {}

  async getById(accountId: string): Promise<GetAccountOutputDto | undefined> {
    const response = await this.httpClient.get(`http://localhost:3000/account/${accountId}`);
    if (!response) return;
    return {
      id: response.accountId,
      name: response.accountName,
      email: response.accountEmail,
      cpf: response.accountCpf,
      isDriver: response.accountIsDriver,
      isPassenger: response.accountIsPassenger,
      carPlate: response.accountCarPlate,
      creditCardToken: response.accountCreditCardToken
    };
  }

  async signup(input: SignupInputDto): Promise<SignupOutputDto | undefined> {
    const response = await this.httpClient.post('http://localhost:3000/signup', input);
    return response;
  }
}
