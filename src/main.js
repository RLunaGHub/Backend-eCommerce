// Herramientas generales
import express from 'express';
import routerProd from './routes/products.routes.js';
import routerCart from './routes/cart.routes.js';
import { _dirname } from './path.js';


const app = express()
const PORT = 8080;

//Middlewares
app.use(express.json()) 
app.use(express.urlencoded ({ extended: true })) // Para trabajar con url´s muy largas

//Routes
app.use('/static', express.static(`${_dirname}/public`));
app.use('/api/products', routerProd);
app.use('/api/carts', routerCart);

app.get('/', (req,res)=>{
	res.status(400).send(`<h1>Welcome to the jungle ♫♫</h1>`)
})
//Server
app.listen(PORT, () =>{
    console.log(`Server on port: ${PORT}`);
    //console.log(`http://localhost:${PORT}`);
    console.log(`Express server listening at http://localhost:${PORT}/static`);
	console.log(`Express server listening at http://localhost:${PORT}/api/products`);
	console.log(`Express server listening at http://localhost:${PORT}/api/products/1`);
	console.log(`Express server listening at http://localhost:${PORT}/api/carts/1`);
});
