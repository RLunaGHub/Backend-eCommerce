import 'dotenv/config';
import express from 'express'; 
import session from 'express-session'; 
import {engine} from 'express-handlebars'; 
import { Server } from 'socket.io'; 
import  {_dirname } from './path.js'; 
import path from 'path'; 
import mongoose from "mongoose"; 
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo'; 
import passport from 'passport'; 
import initializePassport from './config/passport.js'; 
import router from './routes/index.routes.js';
import messageModel from './models/messages.models.js';
import productModel from './models/products.models.js';
import routerHandlebars from './routes/handlebars.routes.js';
import { logger } from './utils/loggers.js'; 
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import cors from 'cors'
import mercadopago from 'mercadopago'

const app = express();
const PORT = 8080;


// const withelist = ['http://localhost:5173']
// const corsOptions = {
// 	origin: function (origin, callback) {
// 		if (withelist.indexOf(origin) != -1 || !origin) { //Existe dentro de whitelist
// 			callback(null, true)
// 		} else {
// 			callback(new Error("Acceso denegado"))
// 		}
// 	}
//   }
  
//   app.use(cors(corsOptions))

const swaggerOptions = {
	definition: {
		openapi: '3.1.0',
		info: {
			title: 'Documentación del Proyecto final Backend ecommerce Coderhouse',
			description: 'API Backend Coderhouse',
		},
	},
	apis: [`${_dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));


const server = app.listen(PORT, () => {
	logger.info (`Servidor desde puerto: ${PORT}`);
	logger.info (`http://localhost:${PORT}`);
});

const io = new Server(server);
function auth(req, res, next) {
	if (req.session.email === 'adminCoder@coder.com') {
		return next();
	} else {
		res.send('No tiene acceso permitido');
	}
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SIGNED_COOKIE));

app.use(
	session({
		
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URL,
			mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
			ttl: 90, 
		}),
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
	})
);
app.engine('handlebars', engine()); 
app.set('view engine', 'handlebars');
app.set('views', path.resolve(_dirname, './views'));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// //latest
// app.use(cors());
// app.get("/", function (req, res) {
// 	res.status(200).sendFile("index.html");
// });

await mongoose
	.connect(process.env.MONGO_URL)
	.then(() => logger.info('DB conectada'))
	.catch(error => logger.error(`Error en conexión a MongoDB Atlas:  ${error}`));

io.on('connection', socket => {
	logger.info ('Conexión con Socket.io');

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


// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
// mercadopago.configure({
// 	access_token: "TEST-6876500445689791-010821-ac8a4a49bb37e21ace37138649971b88-1630540852",
// });


app.use('/static', express.static(path.join(_dirname, "/public")));
app.use('/static', routerHandlebars);
app.use("/", router) 

app.get('/setCookie', (req, res) => {
    res.cookie('Cookie1', 'Este es el valor de una cookie', { maxAge: 60000, signed: true }).send('Cookie creada') //Cookie de un minuto firmada
})

app.get('/getCookie', (req, res) => {
    res.send(req.signedCookies)
    //res.send(req.cookies) Consulta TODAS las cookies
})