// Variables de entorno
import 'dotenv/config'; 
// Herramientas generales
import express from 'express'; //v
import session from 'express-session'; //v
import {engine} from 'express-handlebars'; //v
import { Server } from 'socket.io'; //v
import  {_dirname } from './path.js'; //v
import path from 'path'; //v
import mongoose from "mongoose"; //v
import cookieParser from 'cookie-parser'; //v
import MongoStore from 'connect-mongo'; //v
import passport from 'passport'; //v
import initializePassport from './config/passport.js'; //v
import routerProd from "./routes/products.routes.js"; //v
import routerCart from "./routes/carts.routes.js"; //v
import routerMessage from "./routes/messages.routes.js"; //v
import productModel from './models/products.models.js'; 
import messageModel from './models/messages.models.js'; //v
import routerHandlebars from './routes/handlebars.routes.js';//v
import routerUser from './routes/users.routes.js'; //v
import routerSession from './routes/sessions.routes.js'; //v
import userModel from './models/users.models.js'; //v

const app = express();
const PORT = 8080;

// Server
const server = app.listen(PORT, () => {
	console.log(`Servidor desde puerto: ${PORT}`);
	console.log(`http://localhost:${PORT}`);
});

const io = new Server(server);

//Middlewares
// function auth(req, res, next) {
// 	if (req.session.emial === 'admin@admin.com') {
// 		return next();
// 	} else {
// 		res.send('No tenés acceso a este contenido');
// 	}
// }

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SIGNED_COOKIE)); // firmo la cookie para que si se modifica la cookie no la acepte / lea
app.use(
	session({
		// configuración 
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URL,
			mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
			ttl: 90, // Time to live - duración en mseg
		}),
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
	})
);
app.engine('handlebars', engine()); //defino a handlebars como motor de plantillas
app.set('view engine', 'handlebars');
app.set('views', path.resolve(_dirname, './views'));

// Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('DB conectada'))
	.catch(error => console.log(`Error en conexión a MongoDB Atlas:  ${error}`));

// Conexión con socket.io

io.on('connection', socket => {
	console.log('Conexión con Socket.io');

	socket.on('load', async () => {
		const data = await productModel.paginate({}, { limit: 5 });
		socket.emit('products', data);
	});

	socket.on('loadCart', async () => {
		const cart = await cartModel.findById(cartId).populate('products.id_prod');
		if (cart) {
			socket.emit('cartProducts', { products: cart.products, cid: cartId });
		} else {
			socket.emit('cartProducts', false);
		}
	});

	socket.on('newProduct', async product => {
		await productModel.create(product);
		const products = await productModel.find();

		socket.emit('products', products);
	});

	socket.on('mensaje', async info => {
		const { email, message } = info;
		await messageModel.create({
			email,
			message,
		});
		const messages = await messageModel.find();

		socket.emit('mensajes', messages);
	});
});

// Routes
app.use('/static', express.static(path.join(_dirname, "/public")));
app.use('/static', routerHandlebars);

app.use('/api/products', routerProd); // defino que mi app va a usar lo que venga en routerProd para la ruta que defina
app.use('/api/carts', routerCart);
app.use('/api/messages', routerMessage);
app.use('/api/users', routerUser);
app.use('/api/sessions', routerSession);