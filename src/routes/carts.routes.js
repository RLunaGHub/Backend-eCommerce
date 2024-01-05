import { Router } from "express";
import { passportError, authorization } from "../utils/messageErrors.js";
import cartsController from "../controllers/carts.controller.js";

const cartRouter = Router()

cartRouter.get('/', cartsController.getCarts)
cartRouter.get('/:id', cartsController.getCart)
cartRouter.post('/', cartsController.postCart)
cartRouter.put('/:cid', passportError('jwt'), authorization(['user', 'premium']), cartsController.putCartWithProdsArray)
cartRouter.post('/:cid/product/:pid', passportError('jwt'), authorization(['user', 'premium']), cartsController.addProductCart)
cartRouter.put('/:cid/product/:pid', passportError('jwt'), authorization(['user', 'premium']), cartsController.putProdQty)
cartRouter.delete('/:cid/product/:pid', passportError('jwt'), authorization(['user', 'premium']), cartsController.deleteProdOnCart)
cartRouter.delete('/:id', passportError('jwt'), authorization(['user', 'premium']), cartsController.emptyCart)
cartRouter.post('/:cid', passportError('jwt'), authorization(['user', 'premium']), cartsController.purchase)


export default cartRouter