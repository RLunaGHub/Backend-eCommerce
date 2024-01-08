import cartsModel from "../models/carts.models.js"
import cartModel from "../models/carts.models.js"
import productModel from "../models/products.models.js"
import ticketModel from "../models/tickets.models.js"
import userModel from "../models/users.models.js"
import mongoose from "mongoose"


export const getCarts = async (req, res) => {
    try {
        const carts = await cartsModel.find()
        res.status(200).send({ result: 'OK', message: carts })
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`)
        res.status(500).send({ error: `Error displaying carts:  ${error}` })

    }
}

export const getCart = async (req, res) => {
    const { id } = req.params
    try {
        const cart = await cartsModel.findById(id)
        res.status(200).send({ result: 'OK', message: cart })
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`)
        res.status(404).send({ error: `Id cart not found:  ${error}` })
    }
}

export const postCart = async (req, res) => {
    const response = await cartsModel.create(req.body)
    try {
        res.status(201).send({ result: 'Cart created succesfully', message: response })
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`)
        res.status(400).send({ error: `Cart already exist: ${error}` })
    }
}

export const putCartWithProdsArray = async (req, res) => {
    const { cid } = req.params
    const arrayProds = req.body
    try {
        const cart = await cartModel.findById(cid)
        if (!cart) {
            res.status(404).send({ error: `Cart not found: ${error}` })
            return
        }
        arrayProds.forEach(async (productData) => {
            const { id_prod, quantity } = productData
            const existingProduct = cart.products.find((product) =>
                product.id_prod.equals (id_prod)
            )
            existingProduct
                ? (existingProduct.quantity += quantity)
                : cart.products.push({ id_prod, quantity })
        })
        await cart.save()
        res.status(200).send({ result: 'OK', cart })
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`)
        res.status(500).send({ error: `Error updating cart: ${error}` })
    }
}

export const addProductCart = async (req, res) => {
    const { cid, pid } = req.params;

	try {
		const cart = await cartsModel.findById(cid);
		const product = await productModel.findById(pid);

		if (!product) {
			res.status(404).send({ resultado: 'Product Not Found', message: product });
			return false;
		}

		if (product.stock === 0) {
			console.log(product.stock);
			res.status(400).send({ error: `No hay stock` });
		}

		if (cart) {
			const productExists = cart.products.find(prod => prod.id_prod == pid);

			if (!productExists) {
				cart.products.push({ id_prod: product._id, quantity: 1 });
			} else if (productExists.quantity < product.stock) {
				productExists.quantity++;
			} else {
				return res.status(400).send({ error: `No hay stock suficiente` });
			}

			await cart.save();
			return res.status(200).send({ resultado: 'OK', message: cart });
		} else {
			res.status(404).send({ resultado: 'Cart Not Found', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al crear producto: ${error}` });
	}
};

export const putProdQty = async (req, res) => {
    try {
        const { quantity } = req.body;
        const { cid, pid } = req.params;

        const cart = await cartsModel.findById(cid);
        const findIndex = cart.products.findIndex(product => product.id_prod._id.equals(pid));

        if (findIndex !== -1) {
            cart.products[findIndex].quantity = quantity;
        } else {
            cart.products.push({ id_prod: pid, quantity: quantity });
        }

        await cart.save();
        cart ? res.status(200).send({ resultado: 'OK', message: cart })
            : res.status(404).send({ error: `Carrito no encontrado: ${error}` });
    }
    catch (error) {
        res.status(400).send({ error: `Error al agregar producto al carrito: ${error}` });
    }
}



export const deleteProdOnCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartsModel.findById(cid);
        const findIndex = cart.products.findIndex(product => product.id_prod._id.equals(pid));

        if (findIndex !== -1) {
            cart.products.splice(findIndex, 1);
        }

        await cart.save();

        cart ? res.status(200).send({ resultado: 'OK', message: cart })
            : res.status(404).send({ error: `Carrito no encontrado: ${error}` });
    }
    catch (error) {
        res.status(400).send({ error: `Error al eliminar producto del carrito: ${error}` });
    }
}




export const emptyCart = async (req, res) => {
    const { id } = req.params
    try {
        const cart = await cartsModel.findById(id)
        if (!cart) {
            res.status(404).send({ result: 'Cart not found', message: cart })
        }
        cart.products = []
        await cart.save()
        res.status(200).send({ result: 'OK', message: cart })
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`)
        res.status(400).send({ error: `Error empitying cart: ${cart}` })
    }
}

export const purchase = async (req, res) => {
    const { cid } = req.params
    try {
        const cart = await cartsModel.findById(cid)
        const products = await productModel.find()
        const user = await userModel.find({ cart: cart._id })
        const purchaserEmail = user[0].email
        const userRole = req.user.role || req.user.user.role

        if (!cart) {
            return res.status(404).send({ result: 'Cart not found', message: cart })
        }

        const promises = cart.products.map(async (item) => {
            const product = await productModel.findById(item.id_prod)
            if (!product) {
                throw new Error('Product not found')
            }

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity
                await product.save()

                // Discount for user "premium"
                let discount = 1.0;
                if (userRole === 'premium') {
                    discount = 0.8
                }

                return {
                    productId: product._id,
                    quantity: item.quantity,
                    price: product.price * discount,
                }
            }
            return null // Returns null if the product does not have enough stock
        })

        const results = await Promise.all(promises)
        const prodsToPurchase = results.filter((result) => result !== null)
        console.log(`Products to purchase: ${JSON.stringify(prodsToPurchase)}`)

        if (prodsToPurchase.length === 0) {
            return res.status(400).send({ result: 'No products to purchase' })
        }

        const purchase = {
            items: prodsToPurchase,
            total: prodsToPurchase.reduce((acc, product) => {
                return acc + product.price * product.quantity
            }, 0),
        }

        const ticket = {
            amount: purchase.total,
            purchaser: purchaserEmail
        }
        await ticketModel.create(ticket)
        console.log(`Successful purchase, your total to pay is: $${ticket.amount}`)
        await cartsModel.findByIdAndUpdate(cid, { products: [] })
        return res.status(200).send({ message: "Successful purchase" })
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`)
        return res.status(500).send({ error: `Error processing the purchase: ${error.message}` })
    }
}

const cartsController = {
	getCarts,
	getCart,
	postCart,
	putCartWithProdsArray,
	addProductCart,
	putProdQty,
	deleteProdOnCart,
	emptyCart,
	purchase,
};

export default cartsController;

