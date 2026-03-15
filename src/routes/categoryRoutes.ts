import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '#controllers';
import { validateBody, validateParams } from '#middleware';
import { categoryInputSchema, categoryParamsSchema } from '#schemas';
import { Router } from 'express';

const categoryRoutes = Router();

categoryRoutes
	.route('/')
	.get(getCategories)
	.post(validateBody(categoryInputSchema), createCategory);

categoryRoutes
	.route('/:id')
	.get(validateParams(categoryParamsSchema), getCategory)
	.put(validateParams(categoryParamsSchema), validateBody(categoryInputSchema), updateCategory)
	.delete(validateParams(categoryParamsSchema), deleteCategory);

export default categoryRoutes;