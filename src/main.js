// Herramientas generales
import express from 'express';
import {engine} from 'express-handlebars';
import { Server } from 'socket.io';
import  {_dirname } from './path.js';
import path from 'path';
import mongoose from "mongoose";

import routerProd from "./routes/products.routes.js";
import routerCart from "./routes/carts.routes.js"; //s
import routerMessage from "./routes/messages.routes.js"; // s
import productModel from './models/products.models.js';
import messageModel from './models/message.models.js';


const app = express()
const PORT = 8080;

//Server
const server = app.listen(PORT, () => {
	console.log(`Servidor desde puerto: ${PORT}`);
	console.log(`http://localhost:${PORT}`);
});

const io = new Server(server);

//Middlewares
app.use(express.json()) 
app.use(express.urlencoded ({ extended: true })); // Para trabajar con url´s muy largas
app.engine('handlebars', engine()) //Defino que voy a trabajar con hbs y guardo la config
app.set('view engine', 'handlebars')
app.set('views', path.resolve( _dirname, './views'));

//MongoDB Atlas connection
mongoose.connect('mongodb+srv://ramirolunacoder:coder1234@backend-coderhouse.u3f8jgn.mongodb.net/?retryWrites=true&w=majority')
.then(()=> console.log('DB connected'))
.catch((error)=> console.log(`Error connecting to MongoDB Atlas: ${error}`))

// Socket.io
io.on('connection', socket => {
	console.log('Conexión con Socket.io');

	socket.on('load', async () => {
		const products = await productModel.find();
		socket.emit('products', products);
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

		io.emit('mensajes', messages);
	});
});


// //Routes
// app.use('/static', express.static(`${_dirname}/public`));
// app.use('/api/products', routerProd);
// app.use('/api/carts', routerCart);
// app.use('/api/messages', routerMessage);

// app.get('/static', (req, res) => {
// 	res.render('index', {
// 		rutaCSS: 'index',
// 		rutaJS: 'index',
// 	});
// });

// app.get('/static/realtimeproducts', (req, res) => {
// 	res.render('realTimeProducts', {
// 		rutaCSS: 'realTimeProducts',
// 		rutaJS: 'realTimeProducts',
// 	});
// });

app.get('/static/chat', (req, res) => {
	res.render('chat', {
		rutaCSS: 'chat',
		rutaJS: 'chat',
	});
});