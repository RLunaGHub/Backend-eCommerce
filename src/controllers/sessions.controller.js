import { generateToken } from '../utils/jwt.js';
import userModel from '../models/users.models.js';

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
//add
const sessionRegister =  async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send({ mensaje: 'Usuario ya existente' })
        }
        return res.status(200).send({ mensaje: 'Usuario creado' })
    } catch (error) {
        res.status(500).send({ mensaje: `Error al crear usuario ${error}` })
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

const getLogout = async ( req, res ) => {
    let userDat = {};
    if ( req.session.passport ) {
        userDat = req.session.passport.user;
        const sessionUser = await userModel.findById ( userDat );
        await sessionUser.updateLastConnection ();
        req.session.destroy ();
        return res.status ( 200 ).send ({ result: "Logout done successfully" });
    } else {
        return res.status ( 400 ).send ({ result: "No session active" });
    }
};

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

