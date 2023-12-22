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
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// import { User } from "../entities/User";
const router = express_1.default.Router();
router.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield database_1.default.user.findMany();
    res.status(200).json(users);
}));
router.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, password, email } = req.body;
        let { role } = req.body;
        // Check if the username already exists
        const existingUser = yield database_1.default.user.findUnique({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // If no role is provided, set a default role
        if (!role) {
            role = 'USER';
        }
        // Create the new user
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
}));
router.patch("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const userUpdate = req.body;
    const user = yield database_1.default.user.findUnique({ where: { id } });
    if (!user) {
        res.status(404).json({ error: "User with an id of " + id + " could not be found" });
        return;
    }
    if (!userUpdate.username && !userUpdate.email) {
        res.status(400).json({ error: "User data is missing from request" });
        return;
    }
    const updatedUser = yield database_1.default.user.update({ where: { id }, data: userUpdate });
    res.json(updatedUser);
}));
router.delete("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    if (!id) {
        res.status(400).json({ error: "User ID is incorrect or missing" });
        return;
    }
    const user = yield database_1.default.user.findUnique({ where: { id } });
    if (!user) {
        res.status(404).json({ error: "User with an id of " + id + " could not be found" });
        return;
    }
    const orders = yield database_1.default.order.findMany({ where: { userId: id } });
    for (const order of orders) {
        yield database_1.default.orderProduct.deleteMany({ where: { orderId: order.id } });
        yield database_1.default.order.delete({ where: { id: order.id } });
    }
    yield database_1.default.user.delete({ where: { id } });
    res.status(204).end();
}));
exports.default = router;
