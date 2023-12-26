import express, { Request, Response } from 'express';
import users from './routes/users';
import products from './routes/products';
import orders from './routes/orders';
import signin from './routes/auth/signIn';
import signup from './routes/auth/signUp';
import createAdmin from './routes/auth/createAdmin';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { authorize } from './routes/auth/signIn';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('hii!');
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(express.json());

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
        console.error(err);
        return res.status(400).send({ error: "Malformed JSON in request body" });
    }
    next();
});

//Middlewares
app.use(helmet());
app.use(cors());
app.use(limiter)


try {
    app.use(createAdmin)
    app.use(signup)
    app.use(signin)
    app.use(users);
    app.use(authorize(['ADMIN']), products);
    app.use(orders);

} catch (error) {
    console.error("Something went wrong with a request: " + error)
}



app.listen(port, () => {
    console.log(`Server running!`);
});

app.use((err: any, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
