import mongoose, { Schema } from 'mongoose';

const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    products: [{ productId: Schema.Types.ObjectId, quantity: Number }],
    total: Number
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);