import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const cartSchema = new Schema({
    products: {
        type: [
            {
                id_prod: {
                    type: Schema.Types.ObjectId,
                    ref: 'products',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        default: function () {
            return []
        }
    }
})

cartSchema.pre('findOne', function () {
    this.populate('products.id_prod');
});

cartSchema.plugin(paginate);

const cartsModel = model("carts", cartSchema);

export default cartsModel