import bcrypt from 'bcrypt';
import express from 'express';
import prisma from '../../database';
import { check, validationResult } from 'express-validator';
import { Request, Response } from 'express';

const router = express.Router();

type User = {
    id: number;
    username: string;
    hashedPassword: string;
    role: string;
};

router.post('/auth/signup', [
    check('username').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
    check('email').isEmail().withMessage('must be an email')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, password, email } = req.body;
    let { role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
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

    res.status(200).json({ message: 'User created successfully!', user });
});

export default router;
