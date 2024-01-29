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
const express_1 = __importDefault(require("express"));
const SQLAccountDAO_1 = __importDefault(require("../../dao/SQLAccountDAO"));
const SignupUseCase_1 = __importDefault(require("../../../app/usecase/SignupUseCase"));
const GetAccountUserCase_1 = __importDefault(require("../../../app/usecase/GetAccountUserCase"));
const PGPSQLDataBaseGateway_1 = __importDefault(require("../../gateway/PGPSQLDataBaseGateway"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/account/:accountId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = new PGPSQLDataBaseGateway_1.default();
    db.connect();
    const accountDao = new SQLAccountDAO_1.default(db);
    const useCase = new GetAccountUserCase_1.default(accountDao);
    const result = yield useCase.execute(req.params);
    yield db.query('DELETE FROM account', []);
    db.disconnect();
    res.status(200).send(result);
}));
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = new PGPSQLDataBaseGateway_1.default();
    db.connect();
    const accountDao = new SQLAccountDAO_1.default(db);
    const useCase = new SignupUseCase_1.default(accountDao);
    const result = yield useCase.execute(req.body);
    db.disconnect();
    res.status(201).send(result);
}));
exports.default = app;
