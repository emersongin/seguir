import HttpServer from '../http/HttpServer';
import Signup from '../../app/usecase/Signup';
import GetAccount from '../../app/usecase/GetAccount';
import Registry from '../../infra/di/Registry';

export default class httpController {
	registry: Registry = Registry.getInstance();
  
  constructor (
    readonly httpServer: HttpServer
  ) {
		httpServer.post('/signup', async (params: any, body: any) => {
			const output = await this.registry.inject('signup').execute(body);
			return output;
		});

		httpServer.get('/account/:accountId', async (params: any) => {
			const output = await this.registry.inject('getAccount').execute(params.accountId);
			return output;
		});
	}
}