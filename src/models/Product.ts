import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);