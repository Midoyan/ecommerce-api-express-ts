import { getOrders, createOrder, getOrder, deleteOrder, updateOrder } from '#controllers';
import { validateBody, validateParams } from '#middleware';
import { orderInputSchema, orderParamsSchema } from '#schemas';
import { Router } from 'express';

const orderRoutes = Router();

orderRoutes
    .route('/')
    .get(getOrders)
    .post(validateBody(orderInputSchema), createOrder);

orderRoutes
    .route('/:id')
    .get(validateParams(orderParamsSchema), getOrder)
    .put(validateParams(orderParamsSchema), validateBody(orderInputSchema), updateOrder)
    .delete(validateParams(orderParamsSchema), deleteOrder);

export default orderRoutes;