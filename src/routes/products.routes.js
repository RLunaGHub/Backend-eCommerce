// definición de rutas de la app / products / carts /
// .routes es la ruta a utilizar por convención en la comisión 
import { Router } from 'express';
import productModel from '../models/products.models.js';

const routerProd = Router();
routerProd.get('/', async (req, res) => {
	const { limit, page, sort, category, status } = req.query;
	let sortOption;
	sort == 'asc' && (sortOption = 'price');
	sort == 'desc' && (sortOption = '-price');

	const options = {
		limit: limit || 10,
		page: page || 1,
		sort: sortOption || null,
	};

	const query = {};
	category && (query.category = category);
	status && (query.status = status);

	try {
		const prods = await productModel.paginate(query, options);
		res.status(200).send({ resultado: 'OK', message: prods });
	} catch (error) {
		res.status(400).send({ error: `Error en la consulta de productos: ${error}` });
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

export default routerProd;