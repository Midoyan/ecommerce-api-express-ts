import { getOrders, createOrder, getOrder, deleteOrder, updateOrder } from '#controllers';
import { Router } from 'express';

const orderRoutes = Router();

orderRoutes
    .route('/')
    .get(getOrders)
    .post(createOrder);

orderRoutes
    .route('/:id')
    .get(getOrder)
    .put(updateOrder)
    .delete(deleteOrder);

export default orderRoutes;