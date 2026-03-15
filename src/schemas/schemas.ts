import { z } from 'zod/v4';

const objectIdSchema = z
    .string('Id must be a string')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid id format');

export const userInputSchema = z.object({
    name: z.string('Name must be a string').min(1, 'Name is required'),
    email: z.email('Email must be a valid email address').min(1, 'Email is required'),
    password: z.string('Password must be a string')
        .min(8, 'Password must be at least 8 characters long')
        .max(12, 'Password must be at most 12 characters long')
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, 'Password must contain at least one letter and one number')
});

export const productInputSchema = z.object({
    name: z.string('Product name must be a string').min(1, 'Product name is required'),
    description: z.string('Description must be a string').optional(),
    price: z.number('Price must be a number').positive('Price must be greater than 0'),
    categoryId: objectIdSchema
});

export const orderInputSchema = z.object({
    userId: objectIdSchema,
    products: z.array(z.object({
        productId: objectIdSchema,
        quantity: z.number('Quantity must be a number').positive('Quantity must be greater than 0')
    }))
});

export const categoryInputSchema = z.object({
    name: z.string('Category name must be a string').min(1, 'Category is required')
});

export const idParamsSchema = z.object({
    id: objectIdSchema
});

export const userParamsSchema = idParamsSchema;

export const productParamsSchema = idParamsSchema;

export const productQuerySchema = z.object({
    categoryId: objectIdSchema.optional()
});

export const orderParamsSchema = idParamsSchema;

export const categoryParamsSchema = idParamsSchema;