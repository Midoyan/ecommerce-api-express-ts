import { Category, Product } from '#models';
import { productInputSchema } from '#schemas';
import { normalize } from '#utils';
import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod/v4';

type ProductParams = { id: string };
type ProductQuery = { categoryId?: string };

type ProductInputDTO = z.infer<typeof productInputSchema>;

export const getProducts: RequestHandler<{}, unknown, unknown, ProductQuery> = async (req, res) => {
    const filter: ProductQuery = {};
    const { categoryId } = req.query;

    if (categoryId != null) {
        if (typeof categoryId !== 'string' || !isValidObjectId(categoryId)) { 
            //?categoryId=a&categoryId=b Then many parsers produce an array like ['a', 'b'] => check for type string
            throw new Error('Invalid categoryId format', { cause: { status: 400 } });
        }
        filter.categoryId = categoryId;
    }
    
    const products = await Product.find(filter).lean();
    res.json(products.map(normalize));
}

export const createProduct: RequestHandler<{}, unknown, ProductInputDTO> = async (req, res) => {
    const { name, description, price, categoryId } = req.body;
    if (!name || !categoryId || price == null) {
        throw new Error('Name, price, and categoryId are required', { cause: { status: 400 } });
    }

    const parsedPrice = typeof price === 'string' ? Number(price) : price;

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
        throw new Error('Price must be greater than 0', { cause: { status: 400 } });
    }

    if (!isValidObjectId(categoryId)) {
        throw new Error('Invalid categoryId format', { cause: { status: 400 } });
    }

    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
        throw new Error('Category not found', { cause: { status: 404 } });
    }

    const createdProduct = await Product.create({ name, description, price: parsedPrice, categoryId } satisfies ProductInputDTO);
    res.status(201).json(normalize(createdProduct.toObject()));
}

export const getProduct: RequestHandler<ProductParams> = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        throw new Error('Invalid product id format', { cause: { status: 400 } });
    }

    const foundProduct = await Product.findById(id).lean();
    if (!foundProduct) {
        throw new Error('Product not found', { cause: { status: 404 } });
    }

    res.json(normalize(foundProduct));
}

export const updateProduct: RequestHandler<ProductParams, unknown, ProductInputDTO> = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, categoryId } = req.body;
    if (!isValidObjectId(id)) {
        throw new Error('Invalid product id format', { cause: { status: 400 } });
    }
    
    if (!name || !categoryId || price == null) {
        throw new Error('Name, price, and categoryId are required', { cause: { status: 400 } });
    }

    const parsedPrice = typeof price === 'string' ? Number(price) : price;
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
        throw new Error('Price must be greater than 0', { cause: { status: 400 } });
    }

    if (!isValidObjectId(categoryId)) {
        throw new Error('Invalid categoryId format', { cause: { status: 400 } });
    }

    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
        throw new Error('Category not found', { cause: { status: 404 } });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, { name, description, price: parsedPrice, categoryId } satisfies ProductInputDTO, { returnDocument: 'after' }).lean();
    if (!updatedProduct) {
        throw new Error('Product not found', { cause: { status: 404 } });
    }

    res.json(normalize(updatedProduct));
}

export const deleteProduct: RequestHandler<ProductParams> = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        throw new Error('Invalid product id format', { cause: { status: 400 } });
    }

    const deletedProduct = await Product.findByIdAndDelete(id).lean();
    if (!deletedProduct) {
        throw new Error('Product not found', { cause: { status: 404 } });
    }
    res.status(204).send();
}