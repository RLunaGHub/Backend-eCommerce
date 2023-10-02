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
            email: req.user.email
        }
        return res.redirect('../../static/products'); //Redirect
    } catch (error) {
        res.status(500).send({ message: `Failed to login: ${error}` })
    }
})

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

// routerSession.get('/logout', (req, res) => {
// 	console.log(req.session);
// 	if (req.session) {
//         req.session.destroy()
//     }
//     res.status(200).send({ resultado: 'Login eliminado', message: 'Logout' });
// })

routerSession.get('/logout', (req, res) => {
    if (req.session.user) {
        try {
            req.session.destroy()
            res.status(200).send({ resultado: 'Has cerrado sesion' })
            res.redirect('/static/home');
        }
        catch (error) {
            res.status(400).send({ error: `Error al cerrar sesion: ${error}` });
        }
    } else {
        res.status(400).send({ error: `No hay sesion iniciada` });
    }
})

export default routerSession;




















