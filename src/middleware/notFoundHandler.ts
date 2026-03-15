import type { RequestHandler } from 'express';

const notFoundHandler: RequestHandler = (req, res) => {
    throw new Error(`Route ${req.method} ${req.originalUrl} not found`, { cause: { status: 404 } });
}

export default notFoundHandler;