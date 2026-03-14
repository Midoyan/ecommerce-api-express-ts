import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '#controllers';
import { Router } from 'express';

const productRoutes = Router();

productRoutes
	.route('/')
	.get(getProducts)
	.post(createProduct);

productRoutes
	.route('/:id')
	.get(getProduct)
	.put(updateProduct)
	.delete(deleteProduct);

export default productRoutes;