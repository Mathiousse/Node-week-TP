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
// import { User } from "../entities/User";
const router = express_1.default.Router();
router.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield database_1.default.user.findMany();
    res.json(users);
}));
router.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    if (!user) {
        res.status(400).json({ error: "User data is missing" });
        return;
    }
    const newUser = yield database_1.default.user.create({ data: user });
    res.status(201).json(newUser);
}));
router.put("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const userUpdate = req.body;
    const updatedUser = yield database_1.default.user.update({ where: { id }, data: userUpdate });
    res.json(updatedUser);
}));
router.delete("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    yield database_1.default.user.delete({ where: { id } });
    res.status(204).end();
}));
exports.default = router;
