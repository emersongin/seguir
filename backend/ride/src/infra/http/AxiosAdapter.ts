import axios from "axios";
import HttpClient from './httpClient';

axios.defaults.validateStatus = function () {
	return true;
}

export default class AxiosAdapter implements HttpClient {
	async get(url: string): Promise<any> {
		const response = await axios.get(url);
		if (response.status === 422) return;
		return response.data;
	}

	async post(url: string, data: any): Promise<any> {
		const response = await axios.post(url, data);
		if (response.status === 422) return;
		return response.data;
	}
}