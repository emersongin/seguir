import HttpServerAdapter from '../http/HttpServerAdapter';
import ProcessPayment from '../../app/usecase/ProcessPayment';

export default class MainController {
	constructor (
    readonly httpServer: HttpServerAdapter,
    readonly processPayment: ProcessPayment
  ) {
		httpServer.post('/process_payment', async function (params: any, body: any) {
			const output = await processPayment.execute(body);
			return output;
		});
	}
}