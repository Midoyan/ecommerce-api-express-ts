import { Order, Product, User } from '#models';
import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';

type OrderBody = {
    userId: string,
    products: { productId: string, quantity: number }[]
}

type OrderParams = {
    id: string
}

export const getOrders: RequestHandler = async (req, res) => {
    const orders = await Order.find().lean();
    res.json(orders);
}

export const createOrder: RequestHandler<{}, unknown, OrderBody> = async (req, res) => {
    const { userId, products } = req.body;
    if (!userId || !products) {
        throw new Error('userId and products are required', { cause: { status: 400 } });
    }
    if (!isValidObjectId(userId)) {
        throw new Error('Invalid user id format', { cause: { status: 400 } });
    }
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
        throw new Error('User not found', { cause: { status: 404 } });
    }
    if (!Array.isArray(products)) {
        throw new Error('Products must be an array', { cause: { status: 400 } });
    }

    let total = 0;
    for (const product of products) {
        if (!product.productId || product.quantity == null) {
            throw new Error('productId and quantity are required', { cause: { status: 400 } });
        }
        const parsedQuantity = typeof product.quantity === 'string' ? Number(product.quantity) : product.quantity;
        if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
            throw new Error('Quantity must be a number greater than 0', { cause: { status: 400 } });
        }
        if (!isValidObjectId(product.productId)) {
            throw new Error('Invalid product id format', { cause: { status: 400 } });
        }
        const foundProduct = await Product.findById(product.productId).lean().select('price');
        if (!foundProduct) throw new Error('Product not found', { cause: { status: 404 } });
        total += foundProduct.price * parsedQuantity;
    }

    const order = await Order.create({ userId, products, total });
    res.status(201).json(order);
}

export const getOrder: RequestHandler<OrderParams> = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        throw new Error('Invalid order id format', { cause: { status: 400 } });
    }
    const foundOrder = await Order.findById(id).lean();
    if (!foundOrder) {
        throw new Error('Order not found', { cause: { status: 404 } });
    }

    res.json(foundOrder);
}

export const updateOrder: RequestHandler<OrderParams, unknown, OrderBody> = async (req, res) => {
    const { id } = req.params;
    const { userId, products } = req.body;
    if (!isValidObjectId(id)) {
        throw new Error('Invalid order id format', { cause: { status: 400 } });
    }
    if (!userId || !products) {
        throw new Error('userId and products are required', { cause: { status: 400 } });
    }
    if (!isValidObjectId(userId)) {
        throw new Error('Invalid user id format', { cause: { status: 400 } });
    }
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
        throw new Error('User not found', { cause: { status: 404 } });
    }
    if (!Array.isArray(products)) {
        throw new Error('Products must be an array', { cause: { status: 400 } });
    }
    let total = 0;
    for (const product of products) {
        if (!product.productId || product.quantity == null) {
            throw new Error('productId and quantity are required', { cause: { status: 400 } });
        }
        const parsedQuantity = typeof product.quantity === 'string' ? Number(product.quantity) : product.quantity;
        if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
            throw new Error('Quantity must be a number greater than 0', { cause: { status: 400 } });
        }
        if (!isValidObjectId(product.productId)) {
            throw new Error('Invalid product id format', { cause: { status: 400 } });
        }
        const foundProduct = await Product.findById(product.productId).lean().select('price');
        if (!foundProduct) throw new Error('Product not found', { cause: { status: 404 } });
        total += foundProduct.price * parsedQuantity;
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, { userId, products, total }, { returnDocument: 'after' }).lean();
    if (!updatedOrder) {
        throw new Error('Order not found', { cause: { status: 404 } });
    }
    res.json(updatedOrder);
}

export const deleteOrder: RequestHandler<OrderParams> = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        throw new Error('Invalid order id format', { cause: { status: 400 } });
    }
    const deletedOrder = await Order.findByIdAndDelete(id).lean();
    if (!deletedOrder) {
        throw new Error('Order not found', { cause: { status: 404 } });
    }

    res.status(204).send();
}