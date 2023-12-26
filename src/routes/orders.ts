import express from "express";
import prisma from "../database";
import { check, validationResult } from 'express-validator';
import { Request, Response } from 'express';
import { authorize } from "./auth/signIn";

const router = express.Router();

router.get("/orders", async (req, res) => {
    const orders = await prisma.order.findMany();
    res.status(200).json(orders);
});

router.post("/orders", authorize(['MANAGER', 'ADMIN']), [check('products').isArray().withMessage('Products must be an array')], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const order = req.body as { userId: number, products: { productId: number, quantity: number }[] };
    if (!order.userId || !order.products) {
        res.status(400).json({ error: "Order data is missing from request" });
        return;
    }
    const user = await prisma.user.findUnique({ where: { id: order.userId } });
    if (!user) {
        res.status(400).json({ error: "User with id " + order.userId + " does not exist" });
        return;
    }
    for (const product of order.products) {
        if (isNaN(product.productId)) {
            res.status(400).json({ error: "Product ID must be a number" });
            return;
        }
        const productExists = await prisma.product.findUnique({ where: { id: product.productId } });
        if (!productExists) {
            res.status(400).json({ error: "Product with id " + product.productId + " does not exist" });
            return;
        }
    }
    try {
        const newOrder = await prisma.order.create({
            data: {
                userId: order.userId,
                products: {
                    create: order.products.map(product => ({
                        productId: product.productId,
                        quantity: product.quantity
                    }))
                }
            },
            include: {
                products: true
            }
        });
        res.status(201).json(newOrder);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.patch("/orders/:id", authorize(['MANAGER', 'ADMIN']), async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = parseInt(req.params.id);
    const orderUpdate = req.body as { userId: number, products: { productId: number, quantity: number }[] };
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
        res.status(404).json({ error: "Order with an id of " + id + " could not be found" });
        return;
    }
    if (!orderUpdate.userId && !orderUpdate.products) {
        res.status(400).json({ error: "Order data is missing from request" });
        return;
    }


    for (const product of orderUpdate.products) {

        const productExists = await prisma.product.findUnique({
            where: { id: product.productId }
        });

        if (!productExists) {
            res.status(400).json({ error: "Product with an id of " + product.productId + " does not exist" });
            return;
        }


        const orderProduct = await prisma.orderProduct.findFirst({
            where: { productId: product.productId, orderId: id }
        });

        if (orderProduct) {
            await prisma.orderProduct.update({
                where: { id: orderProduct.id },
                data: { quantity: product.quantity }
            });
        } else {
            await prisma.orderProduct.create({
                data: { productId: product.productId, quantity: product.quantity, orderId: id }
            });
        }
    }

    const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
            userId: orderUpdate.userId,
        },
        include: {
            products: true
        }
    });
    res.json(updatedOrder);
});


router.delete("/orders/:id", authorize(['MANAGER', 'ADMIN']), async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = parseInt(req.params.id);
    if (!id) {
        res.status(400).json({ error: "Order ID is incorrect or missing" });
        return;
    }
    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
        res.status(404).json({ error: "Order with an id of " + id + " could not be found" });
        return;
    }

    await prisma.orderProduct.deleteMany({
        where: { orderId: id }
    });

    await prisma.order.delete({ where: { id } });
    res.status(204).end();
});

export default router;
