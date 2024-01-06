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



// import { Router } from "express";
// import cartsController from "../controllers/carts.controller.js";
// const routerCart = Router();

// routerCart.get("/", cartsController.getCarts);
// routerCart.get("/:cid", cartsController.getCart);
// routerCart.post("/", cartsController.postCart);
// routerCart.post("/:cid/purchase", cartsController.purchaseCart);
// routerCart.put("/:cid/product/:pid", cartsController.putProductToCart);
// routerCart.put("/:cid/products/:pid", cartsController.putQuantity);
// routerCart.put( "/:cid",cartsController.putProductsToCart);
// routerCart.delete( "/:cid",cartsController.deleteCart);
// routerCart.delete("/:cid/products/:pid",cartsController.deleteProductFromCart);

// export default routerCart;