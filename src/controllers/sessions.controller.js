import { generateToken } from '../utils/jwt.js';
import userModel from '../models/users.models.js';

const postSession = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(401).send({ mensaje: 'Invalidate user' });
		}

		const token = generateToken(req.user); 
		res.cookie('jwtCookie', token, {
			
			maxAge: 43200000, 
		});
		const user = userModel.findOne({ email: req.user.email });
		user.last_connection = Date.now();
		await user.save();

		return res.status(200).send('Login generado');
	} catch (error) {
		res.status(500).send({ mensaje: `Error de inicio de sesión ${error}` });
	}
};

const getCurrentSession = async (req, res) => {
	res.status(200).send(req.user);
};

const getGithubCreateUser = async (req, res) => {
	return res.status(200).send({ mensaje: 'Usuario creado' });
};

const getGithubSession = async (req, res) => {
	req.session.user = req.user;
	res.status(200).send({ mensaje: 'Sesión creada' });
};

const getLogout = async (req, res) => {
	if (req.session) {
		req.session.destroy();
		if (req.user) {
			const user = userModel.findOne({ email: req.user.email });
			user.last_connection = Date.now();
			await user.save();
		}
	}
	res.clearCookie('jwtCookie');
	res.status(200).send({ resultado: 'Login eliminado', message: 'Logout' });
};

const sessionController = {
	postSession,
	getCurrentSession,
	getGithubCreateUser,
	getGithubSession,
	getLogout,
};

export default sessionController;