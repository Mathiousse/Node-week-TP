import bcrypt from 'bcrypt';
import express from 'express';
import prisma from '../../database';

const router = express.Router();

type User = {
    id: number;
    username: string;
    hashedPassword: string;
    role: string;
};

router.post('/auth/signup', async (req, res) => {
    const { username, password, email } = req.body;
    let { role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!role) {
        role = 'USER';
    }

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

export default router;
