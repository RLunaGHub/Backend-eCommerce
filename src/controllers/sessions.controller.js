import { generateToken } from '../utils/jwt.js';
import userModel from '../models/users.models.js';
import logger from '../utils/loggers.js';

const sessionUser = (req) => {
    const { first_name, last_name, email, age } = req.user;
    req.session.user = { first_name, last_name, email, age };
}

const postSession = async ( req, res ) => {
    try {
        if ( !req.user ) {
            return res.status ( 401 ).send ( `${ CustomError.Unauthorized ()}` );
        }
        sessionUser(req);
        const token = generateToken ( req.user );
        res.cookie ( "jwtCookie", token, {
            maxAge: 43200000
        })
        return res.status ( 200 ).send ( req.user );
    } catch (error) {
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` ); 
    }
};
// //add
// const sessionRegister =  async (req, res) => {
//     try {
//         if (!req.user) {
//             return res.status(400).send({ mensaje: 'Usuario ya existente' })
//         }
//         return res.status(200).send({ mensaje: 'Usuario creado' })
//     } catch (error) {
//         res.status(500).send({ mensaje: `Error al crear usuario ${error}` })
//     }
// }
const sessionRegister = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).send({ error: `Error al registrar usuario` });
        }
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: req.user.role
        }
        res.status(200).send({ payload: req.user })
    }
    catch (error) {
        logger.error(`Error al registrar usuario: ${error}`);
        res.status(500).send({ mensaje: `Error al registrar usuario ${error}` });
    }
}

const getJWT = async ( req, res ) => {
    sessionUser(req);
    return res.status ( 200 ).send ( req.user ); 
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

// const getLogout = async ( req, res ) => {
//     let userDat = {};
//     if ( req.session.passport ) {
//         userDat = req.session.passport.user;
//         const sessionUser = await userModel.findById ( userDat );
//         await sessionUser.updateLastConnection ();
//         req.session.destroy ();
//         return res.status ( 200 ).send ({ result: "Logout done successfully" });
//     } else {
//         return res.status ( 400 ).send ({ result: "No session active" });
//     }
// };

//add

const getLogout = async (req, res) => {
    if (req.session.user) {
        try {
            //Actualizamos la ultima conexion del usuario
            await userModel.findByIdAndUpdate(req.session.user._id, { last_connection: Date.now() })
            req.session.destroy()
            res.clearCookie('jwtCookie')
            res.status(200).send({ resultado: 'Has cerrado sesion' })
            // res.redirect('/static/login');
        }
        catch (error) {
            res.status(400).send({ error: `Error al cerrar sesion: ${error}` });
        }
    } else {
        res.status(400).send({ error: `No hay sesion iniciada` });
    }
}
const sessionController = {
	postSession,
    sessionRegister,
	getCurrentSession,
	getGithubCreateUser,
	getGithubSession,
	getLogout,
	getJWT,
};

export default sessionController;

