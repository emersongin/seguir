import HttpServer from '../http/HttpServer';
import RequestRide from '../../app/usecase/RequestRide';
import GetRide from '../../app/usecase/GetRide';
import Registry from '../di/Registry';

export default class httpController {
	registry: Registry = Registry.getInstance();

	constructor (
    readonly httpServer: HttpServer
  ) {
		httpServer.post('/ride', async (params: any, body: any) => {
			const output = await this.registry.inject('requestRide').execute(body);
			return output;
		});

		httpServer.get('/ride/:rideId', async (params: any) => {
			const output = await this.registry.inject('getRide').execute(params);
			return output;
		});
	}
}