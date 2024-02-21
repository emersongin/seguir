import HttpServerAdapter from '../http/HttpServerAdapter';
import RequestRide from '../../app/usecase/RequestRide';
import GetRide from '../../app/usecase/GetRide';

export default class MainController {
	constructor (
    readonly httpServer: HttpServerAdapter,
    readonly requestRide: RequestRide,
    readonly getRide: GetRide,
  ) {
		httpServer.post('/ride', async function (params: any, body: any) {
			const output = await requestRide.execute(body);
			return output;
		});

		httpServer.get('/ride/:rideId', async function (params: any) {
			const output = await getRide.execute(params);
			return output;
		});
	}
}