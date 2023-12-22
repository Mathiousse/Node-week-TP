import express from "express";
import prisma from "../database";
// import { Product } from "../models/Product";

const router = express.Router();

router.get("/products", async (req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
});

router.post("/products", async (req, res) => {
    const product = req.body;
    const newProduct = await prisma.product.create({ data: product });
    res.status(201).json(newProduct);
});

router.put("/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const productUpdate = req.body;
    const updatedProduct = await prisma.product.update({ where: { id }, data: productUpdate });
    res.json(updatedProduct);
});

router.delete("/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await prisma.product.delete({ where: { id } });
    res.status(204).end();
});

export default router;