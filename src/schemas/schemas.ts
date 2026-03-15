import { z } from 'zod/v4';

/**
 * @openapi
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Invalid id format
 *       required: [error]
 *     UserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Jane Doe
 *         email:
 *           type: string
 *           format: email
 *           example: jane@example.com
 *         password:
 *           type: string
 *           minLength: 8
 *           maxLength: 12
 *           example: passw0rd
 *       required: [name, email, password]
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 65f2e5d6aa7b2c0f2f116f87
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required: [id, name, email]
 *     CategoryInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Electronics
 *       required: [name]
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 65f2e5d6aa7b2c0f2f116f87
 *         name:
 *           type: string
 *       required: [id, name]
 *     ProductInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Laptop
 *         description:
 *           type: string
 *           example: 16GB RAM, 512GB SSD
 *         price:
 *           type: number
 *           minimum: 0.01
 *           example: 999.99
 *         categoryId:
 *           type: string
 *           example: 65f2e5d6aa7b2c0f2f116f87
 *       required: [name, price, categoryId]
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         categoryId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required: [id, name, price, categoryId]
 *     OrderItemInput:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *           example: 65f2e5d6aa7b2c0f2f116f87
 *         quantity:
 *           type: number
 *           minimum: 1
 *           example: 2
 *       required: [productId, quantity]
 *     OrderInput:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: 65f2e5d6aa7b2c0f2f116f87
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItemInput'
 *       required: [userId, products]
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         productId:
 *           type: string
 *         quantity:
 *           type: number
 *       required: [id, productId, quantity]
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         total:
 *           type: number
 *           example: 1425
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required: [id, userId, products, total]
 */

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