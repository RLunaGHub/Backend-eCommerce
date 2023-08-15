// definición de rutas de la app / products / carts /
// .routes es la ruta a utilizar por convención en la comisión 
import { Router } from 'express';
import { ProductManager } from '../controllers/ProductManager.js';

const routerProd = Router();
const productManager = new ProductManager('./src/models/products.json');

//Traigo todos los productos - método asincrónico - tengo límite
routerProd.get('/', async (req, res) => {
	const { limit } = req.query;

	const prods = await productManager.getProducts();
	const productos = prods.slice(0, limit);

	res.status(200).send(productos);
});

// Consultar por ID 
routerProd.get('/:pid', async (req, res) => {
	const { pid } = req.params;
	const prod = await productManager.getProductById(parseInt(pid));

	prod ? res.status(200).send(prod) : res.status(404).send('No existe producto');
});

//Método post 
routerProd.post('/', async (req, res) => {
	const confirmacion = await productManager.addProduct(req.body);
	confirmacion
		? res.status(200).send('Producto creado')
		: res.status(400).send('Este producto ya existe');
});

//Método put 
routerProd.put('/:pid', async (req, res) => {
	const { pid } = req.params;
	const confirmacion = await productManager.updateProducts(parseInt(pid), req.body);
	confirmacion
		? res.status(200).send('Producto actualizado')
		: res.status(400).send('Ya existente el producto');
});

//Método delete c/ID 
routerProd.delete('/:pid', async (req, res) => {
	const { pid } = req.params;
	const confirmacion = await productManager.deleteProduct(parseInt(pid));
	confirmacion
		? res.status(200).send('Producto eliminado')
		: res.status(404).send('Producto no encontrado');
});

export default routerProd;