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
// import { Product } from "../models/Product";
const router = express_1.default.Router();
router.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield database_1.default.product.findMany();
    res.json(products);
}));
router.post("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = req.body;
    const newProduct = yield database_1.default.product.create({ data: product });
    res.status(201).json(newProduct);
}));
router.put("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const productUpdate = req.body;
    const updatedProduct = yield database_1.default.product.update({ where: { id }, data: productUpdate });
    res.json(updatedProduct);
}));
router.delete("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    yield database_1.default.product.delete({ where: { id } });
    res.status(204).end();
}));
exports.default = router;
