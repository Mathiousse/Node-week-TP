import express from "express";
import prisma from "../database";
import { authorize } from './auth/signIn';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get("/users", authorize(['ADMIN']), async (req, res) => {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
});

// router.post is redundant because of auth/signUp.ts

router.patch("/users/:id", authorize(['ADMIN']), async (req, res) => {
    let user;
    try {
        const id = parseInt(req.params.id);
        if (id !== id) {
            res.status(400).json({ error: "User ID is incorrect or missing" });
            return;
        }

        const userUpdate = req.body;
        try {
            user = await prisma.user.findUnique({ where: { id } });
        } catch (error) {
            res.status(404).json({ error: "User with an id of " + id + " could not be found" });
            return;
        }
        const updatedUser = await prisma.user.update({ where: { id }, data: userUpdate });
        res.json(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

router.delete("/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
        res.status(400).json({ error: "User ID is incorrect or missing" });
        return;
    }
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        res.status(404).json({ error: "User with an id of " + id + " could not be found" });
        return;
    }

    // Check if the user is trying to delete their own account or if they're an admin
    if (req.user.id !== id && req.user.role !== 'ADMIN') {
        console.log(req.user.id, id);
        res.status(403).json({ error: "Forbidden" });
        return;
    }

    const orders = await prisma.order.findMany({ where: { userId: id } });

    for (const order of orders) {
        await prisma.orderProduct.deleteMany({ where: { orderId: order.id } });
        await prisma.order.delete({ where: { id: order.id } });
    }

    await prisma.user.delete({ where: { id } });
    res.status(204).end();
}); export default router;