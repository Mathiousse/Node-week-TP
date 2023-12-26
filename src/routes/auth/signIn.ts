import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';
import prisma from '../../database';

const router = express.Router();

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}

type User = {
    id: number;
    username: string;
    hashedPassword: string;
    role: string;
};

async function validateUser(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (isPasswordValid) {
        return user;
    }
    return null;
}

router.post('/auth/signin', async (req, res) => {
    const { email, password } = req.body;
    const user = await validateUser(email, password);
    if (user) {
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_TOKEN || "");
        req.headers.authorization = token;
        res.status(200).json({ token });
    } else {
        res.status(400).json({ message: 'Invalid email or password' });
    }
});

router.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        console.log(token)
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.JWT_TOKEN || "", (err: any, user: any) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
});

export const authorize = (roles: string[] = []) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};


export default router;
