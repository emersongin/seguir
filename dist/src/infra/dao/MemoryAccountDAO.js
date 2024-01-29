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
const crypto_1 = __importDefault(require("crypto"));
class MemoryAccountDAO {
    constructor() {
        this._accounts = [
            {
                accountId: '382d8d91-34b8-4118-a294-3c22847f48f5',
                name: 'João Silva',
                email: 'joao@hotmail.com',
                cpf: '649.731.080-06',
                isDriver: true,
                isPassenger: false,
                carPlate: 'ABC1234'
            },
            {
                accountId: '79a3baf5-7ad5-41e4-9088-e52a1caba2f1',
                name: 'Maria Silva',
                email: 'maria@hotmail.com',
                cpf: '649.731.080-06',
                isDriver: false,
                isPassenger: true,
                carPlate: null
            }
        ];
    }
    findAccountByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = this._accounts.find(acc => acc.email === email);
            return account || null;
        });
    }
    findAccountById(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this._accounts.find(acc => acc.accountId === accountId);
            return account || null;
        });
    }
    createPassengerAccount(name, email, cpf) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = crypto_1.default.randomUUID();
            const account = {
                accountId: id,
                name,
                email,
                cpf,
                isDriver: false,
                isPassenger: true,
                carPlate: null
            };
            yield this._accounts.push(account);
            return account;
        });
    }
    createDriverAccount(name, email, cpf, carPlate) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = crypto_1.default.randomUUID();
            const account = {
                accountId: id,
                name,
                email,
                cpf,
                isDriver: true,
                isPassenger: false,
                carPlate
            };
            yield this._accounts.push(account);
            return account;
        });
    }
}
exports.default = MemoryAccountDAO;
