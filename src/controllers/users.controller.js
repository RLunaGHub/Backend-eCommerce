import userModel from '../models/users.models.js';
import mailingController from './mail.controller.js';
import { createHash, validatePassword } from '../utils/bcrypt.js';
import crypto from 'crypto';

const postUser = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(400).send({ mensaje: 'Usuario existente' });
		}
		res.status(200).send({ mensaje: 'Usuario creado' });
	} catch (error) {
		res.status(500).send({ mensaje: `Error al crear el usuario ${error}` });
	}
};

const getUser = async ( req, res ) => {
    try {
        const users = await userModel.find ();
        return res.status ( 200 ).send ( users );
    } catch ( error ) {
        logger.warning ( `[ ERROR ] [ ${ new Date ().toLocaleString () } ] Ha ocurrido un error: ${ error.message }` );
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );
    }
};

const recoveryLinks = {};

const passwordRecovery = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await userModel.find({ email: email });
		if (user) {
			const token = crypto.randomBytes(20).toString('hex');
			recoveryLinks[token] = { email, timestamp: Date.now() };
			const recoveryLink = `http://localhost:8080/api/users/resetpassword/${token}`;
			mailingController.sendPasswordRecoveryEmail(email, recoveryLink);
			res.status(200).send('Correo enviado correctamente');
		} else {
			logger.error(`Usuario no encontrado: ${email}`);
			res.status(404).send({ error: 'Usuario no encontrado' });
		}
	} catch (error) {
		logger.error(`Error al enviar email: ${error}`);
		res.status(500).send({ error: `Error al enviar email ${error}` });
	}
};

const passwordReset = async (req, res) => {
	const { token } = req.params;
	const linkData = recoveryLinks[token];
	const { newPassword } = req.body;
	try {
		if (linkData && Date.now() - linkData.timestamp <= 3600000) {
			const { email } = linkData;
			const user = await userModel.findOne({ email: email });
			console.log(newPassword, user.password);
			const arePasswordsEqual = validatePassword(newPassword, user.password);
			if (!arePasswordsEqual) {
				const passwordHash = createHash(newPassword);
				await userModel.findOneAndUpdate({ email: email }, { password: passwordHash });
			} else {
				logger.error(`La nueva contraseña no puede ser igual a la anterior`);
				res.status(400).send(
					'La nueva contraseña no puede ser igual a la anterior'
				);
			}
			delete recoveryLinks[token];
			logger.info(`Contraseña actualizada correctamente ${email}`);
			res.status(200).send('constraseña modificada correctamente');
		} else {
			logger.error(`Token inválido o expirado: ${token}`);
			res.status(400).send('Token inválido o expirado');
		}
	} catch (error) {
		logger.error(`Error al actualizar la contraseña: ${error}`);
		res.status(500).send({ error: `Error al actualizar la contraseña ${error}` });
	}
};

const deleteUser = async (req, res) => {
	const { uid } = req.params;

	try {
		const user = await userModel.findByIdAndDelete(uid);
		if (user) {
			return res.status(200).send({ mensaje: 'Usuario eliminado', user: user });
		}

		res.status(404).send({ error: 'Usuario no encontrado' });
	} catch (error) {
		res.status(500).send({ error: `${uid} Error en eliminar usuario ${error}` });
	}
};

const uploadDocuments = async (req, res) => {
	console.log(req.files);
	try {
		const uid = req.params.uid;
		const newDocuments = req.files.map(file => ({
			name: file.originalname,
			reference: file.path,
		}));

		const user = await userModel.findById(uid);
		user.documents.push(...newDocuments);
		await user.save();

		res.status(200).send({ message: 'Documento subido exitosamente' });
	} catch (error) {
		res.status(500).send('Error al cargar archivo');
	}
};


//inactiva users
const deleteInactiveUsers = async (req, res) => {
    try {
        const inactiveUsers = await userModel.find({
            last_connection: { $lt: new Date(Date.now() - 48 * 60 * 60 * 1000 ) }
        })
        if (inactiveUsers.length > 0) {
            //Get cartId associated with inactive users
            const cartIds = inactiveUsers.map(user => user.cart)
            //Delete associated carts
            await cartModel.deleteMany({ _id: { $in: cartIds } })
            //Delete inactive users
            await userModel.deleteMany({ _id: { $in: inactiveUsers.map(user => user._id) } })
            return res.status(200).send('Inactive users and their carts deleted succesfully')
        } else {
            return res.status(404).send('No inactive users found')
        }
    } catch (error) {
        logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`)
        res.status(500).send({ message: `Error deleting inactive users: ${error}` })
    }
}

const usersController = {
	getUser,
	postUser,
	passwordRecovery,
	passwordReset,
	deleteUser,
	uploadDocuments,
	deleteInactiveUsers,
};

export default usersController;






