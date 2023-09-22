import { Router } from 'express';
import userModel from '../models/users.models.js';

const routerSession = Router();

routerSession.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		if (req.session.login) {
			// si ya hay una sesion activa, que se loguee
			res.status(200).send({ resultado: 'Login ya existente', message: email });
			return;
		}

		const user = await userModel.findOne({ email: email });
		if (user) {
			if (user.password === password) {
				req.session.login = true;
				res.status(200).send({ resultado: 'Login válido', message: user });
			} else {
			}
		} else {
			res.status(404).send({ resultado: 'Not Found', message: user });
		}
	} catch (error) {
		res.status(400).send({ error: `Error en login ${error}` });
	}
});

//Destruye sesión
routerSession.get('/logout', (req, res) => {
	if (req.session.login) {
				req.session.destroy();
	}

	res.status(200).send({ resultado: 'Login eliminado', message: 'Logout' });
});

export default routerSession;