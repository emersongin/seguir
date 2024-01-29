"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
describe('testes para API', () => {
    it('efetuar inscrição como motorista!', () => __awaiter(void 0, void 0, void 0, function* () {
        const newAccount = {
            name: 'João Silva',
            email: 'joao@hotmail.com',
            cpf: '649.731.080-06',
            isDriver: true,
            isPassenger: false,
            carPlate: 'ABC1234'
        };
        const created = yield axios_1.default.post('http://localhost:3000/signup', newAccount);
        expect(created.status).toBe(201);
        const accountId = created.data.accountId;
        const account = yield axios_1.default.get(`http://localhost:3000/account/${accountId}`);
        console.log(account.data);
        expect(account.data.accountId).toEqual(accountId);
        expect(account.data.name).toEqual(newAccount.name);
        expect(account.data.email).toEqual(newAccount.email);
        expect(account.data.cpf).toEqual(newAccount.cpf);
        expect(account.data.isDriver).toEqual(newAccount.isDriver);
        expect(account.data.isPassenger).toEqual(newAccount.isPassenger);
        expect(account.data.carPlate).toEqual(newAccount.carPlate);
    }));
    it('efetuar inscrição como passageiro!', () => __awaiter(void 0, void 0, void 0, function* () {
        const newAccount = {
            name: 'Maria Silva',
            email: 'maria@hotmail.com',
            cpf: '649.731.080-06',
            isDriver: false,
            isPassenger: true
        };
        const created = yield axios_1.default.post('http://localhost:3000/signup', newAccount);
        expect(created.status).toBe(201);
        const accountId = created.data.accountId;
        const account = yield axios_1.default.get(`http://localhost:3000/account/${accountId}`);
        expect(account.data.accountId).toEqual(accountId);
        expect(account.data.name).toEqual(newAccount.name);
        expect(account.data.email).toEqual(newAccount.email);
        expect(account.data.cpf).toEqual(newAccount.cpf);
        expect(account.data.isDriver).toEqual(newAccount.isDriver);
        expect(account.data.isPassenger).toEqual(newAccount.isPassenger);
        expect(account.data.carPlate).toEqual(null);
    }));
});
