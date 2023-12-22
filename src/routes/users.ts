import express from "express";
import prisma from "../database";
// import { User } from "../entities/User";

const router = express.Router();

router.get("/users", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

router.post("/users", async (req, res) => {
    const user = req.body;
    if (!user) {
        res.status(400).json({ error: "User data is missing" });
        return;
    }
    const newUser = await prisma.user.create({ data: user });
    res.status(201).json(newUser);
});


router.put("/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const userUpdate = req.body;
    const updatedUser = await prisma.user.update({ where: { id }, data: userUpdate });
    res.json(updatedUser);
});

router.delete("/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await prisma.user.delete({ where: { id } });
    res.status(204).end();
});
export default router;