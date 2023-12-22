import express, { Request, Response } from 'express';
import users from './routes/users';
import products from './routes/products';
import orders from './routes/orders';
import signin from './routes/auth/signIn';
import signup from './routes/auth/signUp';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('hii!');
});


app.use(express.json());
app.use(users);
app.use(products);
app.use(orders);
app.use(signin)
app.use(signup)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});