import { userRoutes } from '#routes';
import "#db";
import express from 'express';
import { errorHandler, notFoundHandler } from '#middleware';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/users', userRoutes);
app.use(errorHandler);
app.use('*splat', notFoundHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
