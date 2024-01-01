import { Router } from 'express';
import productsController from '../controllers/products.controller.js';


import { authorization, passportError } from '../utils/messageErrors.js';
import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/enums.js';

// const routerProd = Router();

// routerProd.get('/', productsController.getProducts);
// routerProd.get('/:pid', productsController.getProduct);
// // routerProd.post('/', passportError('jwt'), authorization(['admin']), productsController.postProduct);
// routerProd.put(
// 	'/:pid',
// 	passportError('jwt'),
// 	authorization(['admin']),
// 	productsController.putProduct
// );
// routerProd.delete(
// 	'/:pid',
// 	passportError('jwt'),
// 	authorization(['admin']),
// 	productsController.deleteProduct
// );

// routerProd.post('/', (req, res,next) => {
//     const { title, description, stock, price, code, category } = req.body
//     try {
//         if ((!title, !description, !stock, !price, !code, !category)) {
//             CustomError.createError({
//                 name: 'Error creating product',
//                 cause: generateProductErrorInfo({ title, description, stock, price, code, category }),
//                 message: 'All fields must be completed',
//                 code: EErrors.PRODUCT_ERROR,
//             })
//         }
//         next()
//     } catch (error) {
//         next(error)
//     }
// }, passportError('jwt'), authorization('admin'), productsController.postProduct)



// export default routerProd;

const routerProd = Router();

routerProd.get('/', productsController.getProducts);
// routerProd.post('/', (req, res, next) => {
//     const { title, description, price, stock, code, category } = req.body;
//     try {
//         if (!title || !description || !price || !stock || !code || !category) {
//             CustomError.createError({
//                 name: "Product creation error",
//                 cause: generateProductErrorInfo({ title, description, price, stock, code, category }),
//                 message: "One or more properties were incomplete or not valid.",
//                 code: EErrors.INVALID_PRODUCT_ERROR
//             })
//         }
//         next();
//     } catch (error) {
//         next(error);
//     }
// }, passportError('jwt'), authorization(['admin']), productsController.postProduct);
routerProd.post('/', passportError('jwt'), authorization(['admin']), productsController.postProduct);
routerProd.get('/:pid', productsController.getProduct);
routerProd.put('/:pid', passportError('jwt'), authorization(['admin']), productsController.putProduct);
routerProd.delete('/:pid', passportError('jwt'), authorization(['admin']), productsController.deleteProduct);

export default routerProd;
