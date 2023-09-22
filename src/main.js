import 'dotenv/config'; // Variables de entorno
// Herramientas generales
import express from 'express';
import session from 'express-session';
import {engine} from 'express-handlebars';
import { Server } from 'socket.io';
import  {_dirname } from './path.js';
import path from 'path';
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';

import routerProd from "./routes/products.routes.js";
import routerCart from "./routes/carts.routes.js"; //s
import routerMessage from "./routes/messages.routes.js"; // s
import productModel from './models/products.models.js';
import messageModel from './models/messages.models.js';
import cartModel from './models/carts.models.js';
import routerUser from './routes/users.routes.js';
import routerSession from './routes/sessions.routes.js';
import userModel from './models/users.models.js';

const app = express()
const PORT = 8080;

//Server
const server = app.listen(PORT, () => {
	console.log(`Servidor desde puerto: ${PORT}`);
	console.log(`http://localhost:${PORT}`);
});

const io = new Server(server);

//Middlewares
function auth(req, res, next) {
	if (req.session.email === 'adminCoder@coder.com') {
		return next();
	} else {
		res.send('No tiene acceso permitido');
	}
}

app.use(express.json()) 
app.use(express.urlencoded ({ extended: true })); // Para trabajar con url´s muy largas
app.engine('handlebars', engine()) //Defino que voy a trabajar con hbs y guardo la config
app.set('view engine', 'handlebars')
app.set('views', path.resolve( _dirname, './views'));
app.use(cookieParser(process.env.SIGNED_COOKIE)); // Firmar cookies 
app.use(
	session({
		// configuración de la sesión - conexión con BDD
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URL,
			mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
			ttl: 90, // Time to live - duración
		}),
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
	})
);


//MongoDB Atlas connection (ya conectará al iniciar sesión)
mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log('DB connected'))
.catch((error)=> console.log(`Error connecting to MongoDB Atlas: ${error}`))

// Socket.io
io.on('connection', socket => {
	console.log('Conexión con Socket.io');

	socket.on('load', async () => {
		const data = await productModel.paginate({}, { limit: 5 });
		socket.emit('products', data);
	});

	socket.on('previousPage', async page => {
		const data = await productModel.paginate({}, { limit: 5, page: page });
		socket.emit('products', data);
	});

	socket.on('nextPage', async page => {
		const data = await productModel.paginate({}, { limit: 5, page: page });
		socket.emit('products', data);
	});

	socket.on('addProduct', async data => {
		const { pid, cartId } = data;
		if (cartId) {
			const cart = await cartModel.findById(cartId);
			const productExists = cart.products.find(prod => prod.id_prod == pid);
			productExists
				? productExists.quantity++
				: cart.products.push({ id_prod: pid, quantity: 1 });
			await cart.save();
			socket.emit('success', cartId);
		} else {
			const cart = await cartModel.create({});
			cart.products.push({ id_prod: pid, quantity: 1 });
			await cart.save();
			socket.emit('success', cart._id.toString());
		}
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

	socket.on('submit register', async user => {
		const { email } = user;
		const userExists = await userModel.findOne({ email: email });

		if (!userExists) {
			await userModel.create(user);
			socket.emit('register response', true);
		} else {
			socket.emit('register response', false);
		}
	});

	socket.on('logout', () => {
		console.log(session.login);
		if (session.login) {
			console.log(session);
			session.destroy();
			socket.emit('logoutOk');
		}
	});
});

// Cookies

app.get('/setCookie', (req, res) => {
	
	res.cookie('CookieCookie', 'Esto es el valor de una cookie', { maxAge: 300000 }).send(
		'Cookie creada'
	);
	
});

app.get('/getCookie', (req, res) => {
	// res.send(req.cookies); // Consulto todas las cookies
	res.send(req.signedCookies); // Cookies firmadas
});

// Session

app.get('/session', (req, res) => {
	
	if (req.session.counter) {
		req.session.counter++;
		res.send(`Ha entrado ${req.session.counter} veces a la app`);
	} else {
		
		req.session.counter = 1;
		res.send('Bienvenido a la app');
	}
});

app.get('/login', (req, res) => {
	const { email, password } = req.body;

	req.session.email = email;
	req.session.password = password;
	return res.send('Usuario logueado');
});

app.get('/admin', auth, (req, res) => {
	// pasa primero por la autenticación, si me autentico, continuo con la ejecución
	res.send('Admin logueado');
});

app.get('/logout', (req, res) => {
	// de esta forma salgo de la sesion
	req.session.destroy(error => {
		error ? console.log(error) : res.send('Sesión cerrada');
	});
});


//Routes
app.use('/static', express.static(`${_dirname}/public`));
app.use('/static', routerHandlebars);

app.get('/static', (req, res) => {
	res.render('index', {
		rutaCSS: 'index',
		rutaJS: 'index',
	});
});

app.get('/static/realtimeproducts', (req, res) => {
	res.render('realTimeProducts', {
		rutaCSS: 'realTimeProducts',
		rutaJS: 'realTimeProducts',
	});
});

app.get('/static/chat', (req, res) => {
	res.render('chat', {
		rutaCSS: 'chat',
		rutaJS: 'chat',
	});
});

app.get('/static/products', (req, res) => {
	res.render('products', {
		rutaCSS: 'products',
		rutaJS: 'products',
	});
});

app.get('/static/carts/:cid', (req, res) => {
	res.render('carts', {
		rutaCSS: 'carts',
		rutaJS: 'carts',
	});
});

app.use('/api/products', routerProd); 
app.use('/api/carts', routerCart);
app.use('/api/messages', routerMessage);
app.use('/api/users', routerUser);
app.use('/api/sessions', routerSession);