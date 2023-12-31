import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const generateToken = user => {
//process.env.JWT_SECRET
	const token = jwt.sign({ user }, "coderhouse123", { expiresIn: '12h' });
	return token;
};
//token admin
console.log(generateToken ({"_id":{"$oid":"650d015d2e0376986be6db96"},"first_name":"Admin","last_name":"Admin","email":"adminCoder@coder.com","rol":"admin","age":{"$numberInt":"45"},"password":"Coderhouse123","__v":{"$numberInt":"0"}}));

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        req.status(401).send("Usuario no autenticado");
    }
    const token = authHeader.split(' ')[1];

    jwt.sign(token, process.env.JWTSECRET, (err, user) => {
        if (err) {
            req.status(403).send("Token no valido");
        }
        req.user = user;
        next();
    })
}