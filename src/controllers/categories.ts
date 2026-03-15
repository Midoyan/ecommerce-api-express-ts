import { Category } from '#models';
import { normalize } from '#utils';
import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod/v4';
import { categoryInputSchema } from '#schemas';

type CategoryParams = { id: string };

type CategoryInputDTO = z.infer<typeof categoryInputSchema>;

/**
 * @openapi
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *   post:
 *     tags: [Categories]
 *     summary: Create category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Created category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Category already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * /categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Get category by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid id format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     tags: [Categories]
 *     summary: Update category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Updated category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Category already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     tags: [Categories]
 *     summary: Delete category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 *       400:
 *         description: Invalid id format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export const getCategories: RequestHandler = async (req, res) => {
    const categories = await Category.find().lean();
    res.json(categories.map(normalize));
}

export const createCategory: RequestHandler<{}, unknown, CategoryInputDTO> = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        throw new Error('Name is required', { cause: { status: 400 } });
    }

    const existingCategory = await Category.findOne({ name } satisfies CategoryInputDTO).select('_id').lean();
    if (existingCategory) {
        throw new Error('Category already exists', { cause: { status: 409 } });
    }

    const createdCategory = await Category.create({ name } satisfies CategoryInputDTO);
    res.status(201).json(normalize(createdCategory.toObject()));
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

    res.json(normalize(foundCategory));
}

export const updateCategory: RequestHandler<CategoryParams, unknown, CategoryInputDTO> = async (req, res) => {
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

    const existingCategory = await Category.findOne({ name } satisfies CategoryInputDTO).select('_id').lean();
    if (existingCategory && String(existingCategory._id) !== id) {
        throw new Error('Category already exists', { cause: { status: 409 } });
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, { name } satisfies CategoryInputDTO, { returnDocument: 'after' }).lean();
    if (!updatedCategory) {
        throw new Error('Category not found', { cause: { status: 404 } });
    }
    res.json(normalize(updatedCategory));
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