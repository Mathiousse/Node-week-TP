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
const router = express_1.default.Router();
router.get("/orders", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield database_1.default.order.findMany();
    res.json(orders);
}));
router.post("/orders", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = req.body;
    const newOrder = yield database_1.default.order.create({ data: order });
    res.status(201).json(newOrder);
}));
router.put("/orders/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const orderUpdate = req.body;
    const updatedOrder = yield database_1.default.order.update({ where: { id }, data: orderUpdate });
    res.json(updatedOrder);
}));
router.delete("/orders/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const deletedOrder = yield database_1.default.order.delete({ where: { id } });
    res.status(204).end();
}));
exports.default = router;
