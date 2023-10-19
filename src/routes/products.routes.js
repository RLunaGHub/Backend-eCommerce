import { Router } from 'express';
import productsController from '../controllers/products.controller.js';

const routerProd = Router();

routerProd.get('/', productsController.getProducts);
routerProd.get('/:pid', productsController.getProduct);
routerProd.post('/', productsController.postProduct);
routerProd.put('/:pid', productsController.putProduct);
routerProd.delete('/:pid', productsController.deleteProduct);

export default routerProd;