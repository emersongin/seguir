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
Object.defineProperty(exports, "__esModule", { value: true });
const validateCpf_1 = require("../../infra/helpers/validateCpf");
class SignupUseCase {
    constructor(accountDao) {
        this.accountDao = accountDao;
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, cpf, isDriver, isPassenger, carPlate } = input;
            if (!name.match(/[a-zA-Z] [a-zA-Z]+/))
                throw new Error('Invalid user name.');
            if (!email.match(/^(.+)@(.+)$/))
                throw new Error('Invalid email.');
            if (!(0, validateCpf_1.validateCpf)(cpf))
                throw new Error('Invalid cpf.');
            const account = yield this.accountDao.findAccountByEmail(email);
            if (account)
                throw new Error('user already exists.');
            if (isDriver) {
                if (!carPlate.match(/[A-Z]{3}[0-9]{4}/))
                    throw new Error('invalid car plate.');
                const createAccount = yield this.accountDao.createDriverAccount(name, email, cpf, carPlate);
                return createAccount;
            }
            else {
                const createAccount = yield this.accountDao.createPassengerAccount(name, email, cpf);
                return createAccount;
            }
        });
    }
}
exports.default = SignupUseCase;
