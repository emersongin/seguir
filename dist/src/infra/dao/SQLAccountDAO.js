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
class SQLAccountDAO {
    constructor(db) {
        this.db = db;
    }
    findAccountByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const [account] = yield this.db.query("select * from account where email = $1", [email]);
            return account;
        });
    }
    findAccountById(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [account] = yield this.db.query("select * from account where account_id = $1", [accountId]);
            return account;
        });
    }
    createPassengerAccount(name, email, cpf) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = crypto_1.default.randomUUID();
            yield this.db.query("insert into account (account_id, name, email, cpf, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6)", [id, name, email, cpf, true, false]);
            const account = {
                accountId: id,
                name,
                email,
                cpf,
                isDriver: false,
                isPassenger: true,
                carPlate: null
            };
            return account;
        });
    }
    createDriverAccount(name, email, cpf, carPlate) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = crypto_1.default.randomUUID();
            yield this.db.query("insert into account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [id, name, email, cpf, carPlate, false, true]);
            const account = {
                accountId: id,
                name,
                email,
                cpf,
                isDriver: true,
                isPassenger: false,
                carPlate
            };
            return account;
        });
    }
}
exports.default = SQLAccountDAO;
