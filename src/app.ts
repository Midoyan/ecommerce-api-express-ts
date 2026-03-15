import { userRoutes, categoryRoutes, productRoutes, orderRoutes, docsRoutes } from '#routes';
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
app.use('/docs', docsRoutes);
app.use('*splat', notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(
    `\x1b[35mEcommerce app listening at http://localhost:${port}\x1b[0m`
  );
  console.log(
    `\x1b[36mOpenAPI JSON served at  http://localhost:${port}/docs/openapi.json\x1b[0m`
  );
  console.log(
    `\x1b[33mSwagger UI served at http://localhost:${port}/docs\x1b[0m`
  );
});
