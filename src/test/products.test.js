import 'dotenv/config';
import productModel from '../src/models/products.models.js';
import Assert from 'assert';
import mongoose from 'mongoose';

await mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('DB conectada'))
	.catch(error => console.log(`Error en conexión a MongoDB Atlas:  ${error}`));

const assert = Assert.strict;

describe('Products testing', () => {
	beforeEach(function () {
		this.timeout(7000);
	});

	let id;

	it('Crear nuevo producto', async function () {
		const newProduct = {
			title: 'Panqueque',
			description: 'Panqueque de dulce de leche',
			category: 'comida',
			price: 2500,
			stock: 120,
			code: 'S919',
		};
		const resultado = await productModel.create(newProduct);
		id = resultado._id;
		assert.ok(resultado._id);
	});

	it('Consultar un producto por su id', async function () {
		const product = await productModel.findById(id);
		assert.strictEqual(typeof product, 'object');
	});

	it('Eliminar un producto por su id', async function () {
		const product = await productModel.findByIdAndRemove(id);
		assert.strictEqual(typeof product, 'object');
	});

	it('Consultar todos los productos', async function () {
		const products = await productModel.find();
		assert.strictEqual(Array.isArray(products), true);
	});
});