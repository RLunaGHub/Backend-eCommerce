import 'dotenv/config';
import cartModel from '../src/models/carts.models.js';
import Assert from 'assert';
import mongoose from 'mongoose';
import logger from '../src/utils/loggers.js';

const assert = Assert.strict;
describe ( "Carts Testing", () => {
    
    before ( async () => {
        await mongoose.connect ( config.mongoURL );
        logger.http ( `DB connected (test mode)` );
    });
    after ( async () => {
        await mongoose.disconnect ();
        logger.http ( `DB disconnected (test mode)` );
    });
    beforeEach ( function () {
        this.timeout ( 4000 );
    });
    afterEach ( async () => {
        logger.http ( `${ result }` );
    });
    it ( 'Consultar un carrito por ID', async function () {
        const cart = await cartModel.findById ( user.cart );
        assert.strictEqual ( typeof cart , "object", "Cart may be a valid object format" );
    });

	it('Consultar todos los carritos', async function () {
		const carts = await cartModel.find();
		assert.strictEqual(Array.isArray(carts), true);
	});

	
	it('Crear un nuevo carrito', async function () {
		const resultado = await cartModel.create({});
		assert.ok(resultado._id);
	});

	it ( "Vaciar el carrito actualizado por ID", async function () {
		const cartClean = await cartModel.findById ( user.cart );
		cartClean.products.splice ( 0 );
		await cartClean.save ();
		const deletedCart = await cartModel.findById ( user.cart );
		assert.strictEqual(deletedCart.products.length, 0, "Products array is expected to be empty after deletion" );
		result = deletedCart;
	});
});