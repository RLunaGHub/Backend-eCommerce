import { Router } from 'express';
import passport from 'passport';
// import userModel from '../models/users.models.js';

const routerSession = Router();
routerSession.post('/login', passport.authenticate('login'), async (req, res) => {
	try {
		if (!req.user) {
			return res.status(401).send({ mensaje: 'Invalidate user' });
		}

		req.session.user = {
			first_name: req.user.first_name,
			last_name: req.user.last_name,
			age: req.user.age,
			email: req.user.email,
		};

		res.status(200).send({ payload: req.user });
	} catch (error) {
		res.status(500).send({ mensaje: `Error al iniciar sesión ${error}` });
	}
});

routerSession.get(
	'/github',
	passport.authenticate('github', { scope: ['user: email'] }),
	async (req, res) => {
		return res.status(200).send({ mensaje: 'Usuario creado' });
	}
);

routerSession.get('/githubSession', passport.authenticate('github'), async (req, res) => {
	req.session.user = req.user;
	res.status(200).send({ mensaje: 'Sesión creada' });
});

routerSession.get('/logout', (req, res) => {
	console.log(req.session);
	if (req.session) {
		req.session.destroy();
	}

	res.status(200).send({ resultado: 'Login eliminado', message: 'Logout' });
});

export default routerSession;


// routerSession.post('/login', async (req, res) => {
// 	const { email, password } = req.body;

// 	try {
// 		if (req.session.login) {
// 			// Loguea si la sesión está activa
// 			res.status(200).send({ resultado: 'Login ya existente', message: email });
// 			return;
// 		}

// 		if (email === 'adminCoder@coder.com' && password === 'Coderhouse123') {
// 			req.session.login = true;

// 			req.session.user = {
// 				first_name: 'Admin',
// 				last_name: 'Admin',
// 				age: 45,
// 				email: email,
// 				rol: 'admin',
// 			};
// 			res.redirect('../../static/products');
// 			return;
// 		}

// 		const user = await userModel.findOne({ email: email });
// 		if (user) {
// 			if (user.password === password) {
// 				req.session.login = true;
// 				req.session.user = {
// 					first_name: user.first_name,
// 					last_name: user.last_name,
// 					age: user.age,
// 					email: user.email,
// 					rol: user.rol,
// 				};
// 				res.redirect('../../static/products');
// 			} else {
// 				res.status(400).send({
// 					resultado: 'Login inválido',
// 					message: 'Mail o contraseña incorrecta',
// 				});
// 			}
// 		} else {
// 			res.status(404).send({ resultado: 'Not Found', message: user });
// 		}
// 	} catch (error) {
// 		res.status(400).send({ error: `Login error ${error}` });
// 	}
// });

// routerSession.get('/logout', (req, res) => {
// 	if (req.session.login) {
// 		req.session.destroy();
// 	}
// 	res.status(200).send({ resultado: 'logout exitoso' });
// });

// export default routerSession;
