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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("../../database"));
const router = express_1.default.Router();
function validateUser(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield database_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return null;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.hashedPassword);
        if (isPasswordValid) {
            return user;
        }
        return null;
    });
}
router.post('/auth/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield validateUser(email, password);
    if (user) {
        const token = jsonwebtoken_1.default.sign({ sub: user.id, role: user.role }, process.env.JWT_TOKEN || "");
        res.status(200).json({ token });
    }
    else {
        res.status(400).json({ message: 'Invalid email or password' });
    }
}));
router.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN || "", (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
});
function authorize(roles = []) {
    return (req, res, next) => {
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(401).json({ message: 'Unauthorizedd' });
        }
        next();
    };
}
router.get('/protected', authorize(['Admin', 'Manager']), (req, res) => {
    res.status(200).json({ message: 'You are authorized' });
});
exports.default = router;
