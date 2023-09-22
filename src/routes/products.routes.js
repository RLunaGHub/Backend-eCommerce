// definición de rutas de la app / products / carts /
// .routes es la ruta a utilizar por convención en la comisión 
import { Router } from 'express';
import productModel from '../models/products.models.js';

const routerProd = Router();
routerProd.get('/', async (req, res) => {
	const { limit } = req.query;
	try {
		const prods = await productModel.find().limit(limit);
		res.status(200).send({ resultado: 'OK', message: prods });
	} catch (error) {
		res.status(400).send({ error: `Error al consultar productos: ${error}` });
	}
});
routerProd.get('/:pid', async (req, res) => {
	const { pid } = req.params;
	try {
		const prod = await productModel.findById(pid);
		prod
			? res.status(200).send({ resultado: 'OK', message: prod })
			: res.status(404).send({ resultado: 'Not Found', message: prod });
	} catch (error) {
		res.status(400).send({ error: `Error al consultar producto: ${error}` });
	}
});

routerProd.post('/', async (req, res) => {
	const { title, description, stock, code, price, category } = req.body;

	try {
		const respuesta = await productModel.create({
			title,
			description,
			category,
			stock,
			code,
			price,
		});
		res.status(200).send({ resultado: 'OK', message: respuesta });
	} catch (error) {
		res.status(400).send({ error: `Error al crear producto: ${error}` });
	}
});

// {
//     "title": "Doble",
//     "description": "cola",
//     "stock": 5,
//     "code": "D456",
//      "price": 100,
//      "category": "gaseosas"

        
//     }



routerProd.put('/:pid', async (req, res) => {
	const { pid } = req.params;
	const { title, description, stock, code, price, category, status } = req.body;
	try {
		const prod = await productModel.findByIdAndUpdate(pid, {
			title,
			description,
			category,
			stock,
			code,
			price,
		});
		prod
			? res.status(200).send({ resultado: 'OK', message: prod })
			: res.status(404).send({ resultado: 'Not Found', message: prod });
	} catch (error) {
		res.status(400).send({ error: `Error al actualizar el producto: ${error}` });
	}
});
// _id 64fa38849dd6cd4d0367d0dd - price: 20000
routerProd.delete('/:pid', async (req, res) => {
	const { pid } = req.params;
	try {
		const prod = await productModel.findByIdAndDelete(pid);
		prod
			? res.status(200).send({ resultado: 'OK', message: prod })
			: res.status(404).send({ resultado: 'Not Found', message: prod });
	} catch (error) {
		res.status(400).send({ error: `Error al eliminar el producto: ${error}` });
	}
});
// http://localhost:8080/api/products/6503ab80b6d6aff05631605d

export default routerProd;