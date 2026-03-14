import { Category } from '#models';
import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';

type CategoryParams = { id: string };

type CategoryBody = {
    name: string
}

export const getCategories: RequestHandler = async (req, res) => {
    const categories = await Category.find().lean();
    res.json(categories);
}

export const createCategory: RequestHandler<{}, unknown, CategoryBody> = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        throw new Error('Name is required', { cause: { status: 400 } });
    }

    const existingCategory = await Category.findOne({ name }).select('_id').lean();
    if (existingCategory) {
        throw new Error('Category already exists', { cause: { status: 409 } });
    }

    const createdCategory = await Category.create({ name });
    res.status(201).json(createdCategory);
}

export const getCategory: RequestHandler<CategoryParams> = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        throw new Error('Invalid category id format', { cause: { status: 400 } });
    }

    const foundCategory = await Category.findById(id).lean();
    if (!foundCategory) {
        throw new Error('Category not found', { cause: { status: 404 } });
    }

    res.json(foundCategory);
}

export const updateCategory: RequestHandler<CategoryParams, unknown, CategoryBody> = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
        throw new Error('Name is required', { cause: { status: 400 } });
    }

    if (!isValidObjectId(id)) {
        throw new Error('Invalid category id format', { cause: { status: 400 } });
    }

    const existingCategoryById = await Category.findById(id).select('_id').lean();
    if (!existingCategoryById) {
        throw new Error('Category not found', { cause: { status: 404 } });
    }

    const existingCategory = await Category.findOne({ name }).select('_id').lean();
    if (existingCategory && String(existingCategory._id) !== id) {
        throw new Error('Category already exists', { cause: { status: 409 } });
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, { name }, { returnDocument: 'after' }).lean();
    if (!updatedCategory) {    
        throw new Error('Category not found', { cause: { status: 404 } });
    }
    res.json(updatedCategory);
}

export const deleteCategory: RequestHandler<CategoryParams> = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        throw new Error('Invalid category id format', { cause: { status: 400 } });
    }

    const deletedCategory = await Category.findByIdAndDelete(id).lean();
    if (!deletedCategory) {
        throw new Error('Category not found', { cause: { status: 404 } });
    }

    res.status(204).send();
}