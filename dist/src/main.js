"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = __importDefault(require("./infra/web/express/main"));
main_1.default.listen(3000, () => {
    console.log('Server is running on port 3000');
});
