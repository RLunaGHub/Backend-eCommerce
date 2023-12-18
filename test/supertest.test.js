import 'dotenv/config';
import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import logger from '../src/utils/loggers';


await mongoose
	.connect(process.env.MONGO_URL)
	.then(() => logger.info ('DB conectada (test mode)'))
	.catch(error => logger.error(`Error en conexión a MongoDB Atlas (test mode):  ${error}`));

const expect = chai.expect;
const requester = supertest('http://localhost:8080/');

describe('App testing', () => {
	let token = {}
    let cartId = ""
    let userId = ""

	const newUser = {
		first_name: 'Silvio',
		last_name: 'Soldan',
		email: 'silvio@soldan.com',
		age: 89,
		password: 'ssoldan'
	};

	it('Endpoint test /api/users/register, se espera que cree un nuevo usuario', async function () {
        this.timeout(5000)        

        const { __body, status } = await requester.post('/api/users/register').send(newUser);

        expect(status).to.equal(200); 
        logger.info(`Status: ${__body}`);
    });


	it('Endpoint test /api/sessions/login, se espera que el usuario se loguee', async function () {
        this.timeout(5000)

		const response = await requester.post('api/session/login').send(newUser)
        const { __body } = response
        const tokenResult = response.header['jwt-cookie'][0];

        expect(tokenResult).to.be.ok;
        expect(response.status).to.be.equal(200);

        token = {
            name: tokenResult.split('=')[0],
            value: tokenResult.split('=')[1]
        };

        expect(token).to.be.ok;
        expect(token.name).to.be.ok.and.equal('jwtCookie');
		expect(__body.cartId).to.be.ok

        userId = __body._id
        cartId = __body.cartId
        logger.info(`Token: ${token.name} = ${token.value}`);
    });

    it('Endpoint test /api/sessions/current, se espera la sesión del usuario actual', async function () {
        const sessionData = await requester.get ( "/api/session/current" ).set ( "Cookie", token );
        expect ( sessionData.status ).to.equal ( 200 );
        expect ( sessionData.body.user ).to.have.property ( "_id" ).to.be.a ( "string" );
            
    });

	it ('Endpoint test /api/session/logout, se espera que cierre la sesión', async function () {
		const terminate = await requester.get ( "/api/session/logout" );
		expect ( terminate.status ).to.equal ( 200 );
		expect ( terminate.body ).to.have.property ( "result" ).to.be.a ( "string" );
	});
});

describe ( "Products test", () => {
	it ( "Endpoint test /api/products, se espera que cree un producto", async function () {
		const newProduct = await requester.post ( "/api/products" ).send ( product ).set ( "Cookie", token );
		expect ( newProduct.status ).to.equal ( 201 );
		expect ( newProduct.body ).to.have.property ( "status" ).to.be.a ( "boolean" );
		prodId = newProduct.body._id;	
	});
	it ( "Endpoint test /api/products/:id, se espera que actualice un producto por su Id", async function () {
		const actualizedProduct = {
			title: "Panquecón",
			category: "comida"
		}
		const updatedProduct = await requester.put ( `/api/products/${ prodId }` ).send ( actualizedProduct ).set ( "Cookie", token );
		expect ( updatedProduct.status ).to.equal ( 200 );
		expect ( updatedProduct.body ).to.have.property ( "_id" ).to.be.a ("string");
	});
	it ( "Endpoint test /api/products:id, se espera que elimine un producto por su Id", async function () {
		const eliminateProduct = await requester.delete ( `/api/products/${ prodId }` ).set ( "Cookie", token );
		expect ( eliminateProduct.status ).to.equal ( 200 );
		expect ( eliminateProduct.body ).to.have.property ( "_id" ).to.be.a ("string");
	});
});