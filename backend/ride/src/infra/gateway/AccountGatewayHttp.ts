import axios from 'axios';
import AccountGateway, { 
  GetAccountOutputDto, 
  SignupInputDto, 
  SignupOutputDto 
} from './AccountGateway';

axios.defaults.validateStatus = function () {
	return true;
}

export default class AccountGatewayHttp implements AccountGateway {
  async getById(accountId: string): Promise<GetAccountOutputDto | undefined> {
    const response = await axios.get(`http://localhost:3000/account/${accountId}`);
    if (response.status === 422) return;
    const account = response.data;
    return {
      id: account.accountId,
      name: account.accountName,
      email: account.accountEmail,
      cpf: account.accountCpf,
      isDriver: account.accountIsDriver,
      isPassenger: account.accountIsPassenger,
      carPlate: account.accountCarPlate
    };
  }

  async signup(input: SignupInputDto): Promise<SignupOutputDto | undefined> {
    const response = await axios.post('http://localhost:3000/signup', input);
    if (response.status === 422) return;
    return response.data;
  }
}
