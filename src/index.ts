import express, { Request, Response } from 'express';
import users from './routes/users';
import products from './routes/products';
import orders from './routes/orders';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.use(users);
app.use(products);
app.use(orders);