import express, { Express } from 'express';
import HttpServerAdapter from './HttpServerAdapter';

export default class ExpressAdapter implements HttpServerAdapter {
	app: Express;

	constructor () {
		this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
	}

	async get(url: string, callback: Function): Promise<void> {
		this.app.get(url, async (req: any, res: any) => {
      await this.command(callback, req, res);
    });
	}

  async post(url: string, callback: Function): Promise<void> {
		this.app.post(url, async (req: any, res: any) => {
      await this.command(callback, req, res);
    });
	}

  async command(callback: Function, req: any, res: any) {
    try {
      const output = await callback(req.params, req.body);
      res.json(output);
    } catch (e: any) {
      return res.status(422).json({
        message: e.message
      });
    }
  }

	async listen(port: number, callback: Function): Promise<void> {
		this.app.listen(port, () => callback());
	}
}