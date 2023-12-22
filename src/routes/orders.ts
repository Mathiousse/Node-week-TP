import express from "express";
import prisma from "../database";
const router = express.Router();

router.get("/orders", async (req, res) => {
    const orders = await prisma.order.findMany();
    res.json(orders);
});

router.post("/orders", async (req, res) => {
    const order = req.body;
    const newOrder = await prisma.order.create({ data: order });
    res.status(201).json(newOrder);
});

router.put("/orders/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const orderUpdate = req.body;
    const updatedOrder = await prisma.order.update({ where: { id }, data: orderUpdate });
    res.json(updatedOrder);
});

router.delete("/orders/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const deletedOrder = await prisma.order.delete({ where: { id } });
    res.status(204).end();
});
export default router;