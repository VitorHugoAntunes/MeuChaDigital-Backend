"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const body_parser_1 = __importDefault(require("body-parser"));
const PORT = process.env.PORT || 8000;
app_1.default.use(body_parser_1.default.json());
app_1.default.listen(PORT, () => {
    console.log('Hello');
    console.log(`Server is running at http://localhost:${PORT}`);
});
