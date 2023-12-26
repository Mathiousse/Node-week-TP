import express from 'express';
import prisma from '../../database';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { check, validationResult } from 'express-validator';
import { Request, Response } from 'express';

const router = express.Router();

router.post('/auth/createAdmin', [
    check('username').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
    check('email').isEmail().withMessage('must be an email')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, password, email, adminToken } = req.body;
    if (adminToken !== process.env.ADMIN_TOKEN) {
        return res.status(403).json({ message: 'Invalid token' });
    }
    const existingAdmin = await prisma.user.findFirst({ where: { email: email } });
    if (existingAdmin) {
        return res.status(403).json({ message: 'Could not create the account: a user already exists with this email' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: User = await prisma.user.create({
        data: {
            username,
            hashedPassword,
            role: 'ADMIN',
            email,
        },
    });
    const jwtToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_TOKEN || "");
    res.status(200).json({ message: 'Admin user created successfully!', user, jwtToken });
});

export default router