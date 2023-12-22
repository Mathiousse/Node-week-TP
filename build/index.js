"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./routes/users"));
const products_1 = __importDefault(require("./routes/products"));
const orders_1 = __importDefault(require("./routes/orders"));
const signIn_1 = __importDefault(require("./routes/auth/signIn"));
const signUp_1 = __importDefault(require("./routes/auth/signUp"));
const app = (0, express_1.default)();
const port = 3000;
app.get('/', (req, res) => {
    res.send('hii!');
});
app.use(express_1.default.json());
app.use(users_1.default);
app.use(products_1.default);
app.use(orders_1.default);
app.use(signIn_1.default);
app.use(signUp_1.default);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
