export const normalize = <T extends Record<string, unknown>>(doc: T) => {
    const { _id, ...rest } = doc;
    return { id: String(_id), ...rest };
};

type OrderProduct = {
    _id: string;
    productId: string;
    quantity: number;
};

export const normalizeOrder = (order: Record<string, unknown>) => {
    const { _id, userId, products, ...rest } = order;
    return {
        id: String(_id),
        userId: String(userId),
        products: (products as OrderProduct[]).map(({ _id: pid, productId, ...p }) => ({
            id: String(pid),
            productId: String(productId),
            ...p,
        })),
        ...rest,
    };
};

export default normalize;