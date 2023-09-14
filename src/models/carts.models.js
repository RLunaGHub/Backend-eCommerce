import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
	products: {
		type: [
			{
				id_prod: {
					type: Schema.Types.ObjectId, // ID autogenerado Mongo
					ref: 'products',
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
			},
		],
		default: function () {
			return [];
		},
	},
});

/*
const res = await cartModel
 	.findOne({ _id: '64f7bb1bf65706e542ebc0ab' })
 	.populate('products.id_prod');
 console.log(JSON.stringify(res));

Como buscar para que te traiga la info de la referencia
*/

cartSchema.pre('find', function () {
	this.populate('products.id_prod');
});

const cartModel = model('carts', cartSchema);

export default cartModel;