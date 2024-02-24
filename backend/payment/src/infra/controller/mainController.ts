import HttpServerAdapter from '../http/HttpServerAdapter';
import ProcessPayment from '../../app/usecase/ProcessPayment';
import GetTransactionByRide from '../../app/usecase/GetTransactionByRide';

export default class MainController {
	constructor (
    readonly httpServer: HttpServerAdapter,
    readonly processPayment: ProcessPayment,
		readonly getTransactionByRide: GetTransactionByRide
  ) {
		httpServer.post('/process_payment', async function (params: any, body: any) {
			const output = await processPayment.execute(body);
			return output;
		});

		httpServer.get('/transaction/:rideId', async function (params: any, body: any) {
			const output = await getTransactionByRide.execute(params.rideId);
			return output;
		});
	}
}