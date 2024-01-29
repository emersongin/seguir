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
const SignupUseCase_1 = __importDefault(require("../src/app/usecase/SignupUseCase"));
const MemoryAccountDAO_1 = __importDefault(require("../src/infra/dao/MemoryAccountDAO"));
describe('testes para função de inscrever-se', () => {
    it('efetuar inscrição como motorista!', () => __awaiter(void 0, void 0, void 0, function* () {
        const accountDao = new MemoryAccountDAO_1.default();
        const useCase = new SignupUseCase_1.default(accountDao);
        const input = {
            name: 'João Silva Novo',
            email: 'joao_novo@hotmail.com',
            cpf: '649.731.080-06',
            isDriver: true,
            isPassenger: false,
            carPlate: 'ABC1234'
        };
        const output = yield useCase.execute(input);
        expect(output).toHaveProperty('accountId');
    }));
});
// invalid name
// invalid email
// already exists
// invalid cpf
// invalid car plate
