import HttpServerAdapter from '../http/HttpServerAdapter';
import Signup from '../../app/usecase/Signup';
import GetAccount from '../../app/usecase/GetAccount';
import RequestRide from '../../app/usecase/RequestRide';
import GetRide from '../../app/usecase/GetRide';

export default class MainController {
	constructor (
    readonly httpServer: HttpServerAdapter,
    readonly signupUseCase: Signup,
    readonly getAccountUseCase: GetAccount,
  ) {
		httpServer.post('/signup', async function (params: any, body: any) {
			const output = await signupUseCase.execute(body);
			return output;
		});

		httpServer.get('/account/:accountId', async function (params: any) {
			const output = await getAccountUseCase.execute(params);
			return output;
		});
	}
}