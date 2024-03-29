import { Schema, model } from "mongoose";
import paginate from 'mongoose-paginate-v2';

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    thumbnail: [],
    code: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
});


productSchema.plugin(paginate);

const productModel = model('products', productSchema);

export default productModel;