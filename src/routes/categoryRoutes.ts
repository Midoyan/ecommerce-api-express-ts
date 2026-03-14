import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '#controllers';
import { Router } from 'express';

const categoryRoutes = Router();

categoryRoutes
	.route('/')
	.get(getCategories)
	.post(createCategory);

categoryRoutes
	.route('/:id')
	.get(getCategory)
	.put(updateCategory)
	.delete(deleteCategory);

export default categoryRoutes;