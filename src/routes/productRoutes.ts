import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '#controllers';
import { validateBody, validateParams, validateQuery } from '#middleware';
import { productInputSchema, productParamsSchema, productQuerySchema } from '#schemas';
import { Router } from 'express';

const productRoutes = Router();

productRoutes
	.route('/')
	.get(validateQuery(productQuerySchema), getProducts)
	.post(validateBody(productInputSchema), createProduct);

productRoutes
	.route('/:id')
	.get(validateParams(productParamsSchema), getProduct)
	.put(validateParams(productParamsSchema), validateBody(productInputSchema), updateProduct)
	.delete(validateParams(productParamsSchema), deleteProduct);

export default productRoutes;