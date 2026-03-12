import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from "#controllers";
import { Router } from "express";

const categoryRoutes = Router();

categoryRoutes.get('/', getCategories);
categoryRoutes.post('/', createCategory);
categoryRoutes.get('/:id', getCategory);
categoryRoutes.put('/:id', updateCategory);
categoryRoutes.delete('/:id', deleteCategory);

export default categoryRoutes;