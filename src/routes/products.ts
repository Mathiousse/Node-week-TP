import express from "express";
import prisma from "../database";

const router = express.Router();

router.get("/products", async (req, res) => {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
});

router.post("/products", async (req, res) => {
    const product = req.body;
    if (!product.name || !product.price || !product.stock) {
        res.status(400).json({ error: "Product data is missing from request" });
        return;
    }
    try {
        const newProduct = await prisma.product.create({ data: product });
        res.status(201).json(newProduct);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.patch("/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const productUpdate = req.body;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
        res.status(404).json({ error: "Product with an id of " + id + " could not be found" });
        return;
    }
    if (!productUpdate.name && !productUpdate.price && !productUpdate.stock) {
        res.status(400).json({ error: "Product data is missing from request" });
        return;
    }
    const updatedProduct = await prisma.product.update({ where: { id }, data: productUpdate });
    res.json(updatedProduct);
});

router.delete("/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
        res.status(400).json({ error: "Product ID is incorrect or missing" });
        return;
    }
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
        res.status(404).json({ error: "Product with an id of " + id + " could not be found" });
        return;
    }
    await prisma.product.delete({ where: { id } });
    res.status(204).end();
});

export default router;
