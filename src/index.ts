import express, { Request, Response } from 'express';
import users from './routes/users';
import products from './routes/products';
import orders from './routes/orders';
import signin from './routes/auth/signIn';
import signup from './routes/auth/signUp';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('hii!');
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

//Middlewares
app.use(helmet());
app.use(cors());
app.use(limiter)

app.use(express.json());
app.use(signup)
app.use(users);
app.use(products);
app.use(orders);
app.use(signin)


app.listen(port, () => {
    console.log(`Server running!`);
});

app.use((err: any, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
