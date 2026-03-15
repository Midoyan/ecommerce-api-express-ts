import { userRoutes, categoryRoutes, productRoutes, orderRoutes } from '#routes';
import '#db';
import express from 'express';
import { errorHandler, notFoundHandler } from '#middleware';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('*splat', notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
