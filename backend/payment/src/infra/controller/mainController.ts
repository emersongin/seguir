import HttpServerAdapter from '../http/HttpServerAdapter';
import ProcessPayment from '../../app/usecase/ProcessPayment';
import GetRideTransaction from '../../app/usecase/GetRideTransaction';

export default class MainController {
	constructor (
    readonly httpServer: HttpServerAdapter,
    readonly processPayment: ProcessPayment,
		readonly getRideTransaction: GetRideTransaction
  ) {
		httpServer.post('/process_payment', async function (params: any, body: any) {
			const output = await processPayment.execute(body);
			return output;
		});

		httpServer.get('/transaction/:rideId', async function (params: any, body: any) {
			const output = await getRideTransaction.execute(params.rideId);
			return output;
		});
	}
}