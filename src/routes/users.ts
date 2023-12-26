import express from "express";
import prisma from "../database";
import bcrypt from "bcrypt";
// import { User } from "../entities/User";

const router = express.Router();

router.get("/users", async (req, res) => {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
});

type User = {
    id: number;
    username: string;
    hashedPassword: string;
    role: string;
};

router.post("/users", async (req, res) => {
    router.post('/signup', async (req, res) => {
        const { username, password, email } = req.body;
        let { role } = req.body;

        // Check if the username already exists
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // If no role is provided, set a default role
        if (!role) {
            role = 'USER';
        }

        // Create the new user
        const user: User = await prisma.user.create({
            data: {
                username,
                hashedPassword,
                role,
                email,
            },
        });

        res.status(200).json({ message: 'User created successfully', user });
    });

});


router.patch("/users/:id", async (req, res) => {
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
        if (!userUpdate.username && !userUpdate.email) {
            res.status(400).json({ error: "User data is missing from request" });
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

    const orders = await prisma.order.findMany({ where: { userId: id } });

    for (const order of orders) {
        await prisma.orderProduct.deleteMany({ where: { orderId: order.id } });
        await prisma.order.delete({ where: { id: order.id } });
    }

    await prisma.user.delete({ where: { id } });
    res.status(204).end();
});
export default router;