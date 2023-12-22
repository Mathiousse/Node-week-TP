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
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("../../database"));
const router = express_1.default.Router();
router.post('/auth/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.body;
    let { role } = req.body;
    const existingUser = yield database_1.default.user.findUnique({ where: { username } });
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    if (!role) {
        role = 'USER';
    }
    const user = yield database_1.default.user.create({
        data: {
            username,
            hashedPassword,
            role,
            email,
        },
    });
    res.status(200).json({ message: 'User created successfully', user });
}));
exports.default = router;
