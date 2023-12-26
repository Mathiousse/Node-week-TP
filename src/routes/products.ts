import express from "express";
import prisma from "../database";
import { check, validationResult } from 'express-validator';
import { Request, Response } from 'express';
import { authorize } from "./auth/signIn";

const router = express.Router();

router.get("/products", async (req, res) => {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
});

router.post("/products", [
    check('name').notEmpty().withMessage('Name is required'),
    check('price').isNumeric().withMessage('Price must be a number'),
    check('stock').isNumeric().withMessage('Stock must be a number')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
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
    if (isNaN(id)) {
        res.status(400).json({ error: "Incorrect product ID" });
        return;
    } const productUpdate = req.body;
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
    if (isNaN(id)) {
        res.status(400).json({ error: "Incorrect product ID" });
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
