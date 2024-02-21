import axios from 'axios';
import AccountGateway, { 
  GetAccountOutputDto, 
  SignupInputDto, 
  SignupOutputDto 
} from './AccountGateway';


export default class AccountGatewayHttp implements AccountGateway {
  async getById(accountId: string): Promise<GetAccountOutputDto | undefined> {
    const response = await axios.get(`http://localhost:3000/account/${accountId}`);
    console.log(response);
    if (response.status === 422) return;
    return response.data;
  }

  async signup(input: SignupInputDto): Promise<SignupOutputDto | undefined> {
    const response = await axios.post('http://localhost:3000/signup', input);
    console.log(response);
    if (response.status === 422) return;
    return response.data;
  }
}
