import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
//process.env.JWT_SECRET
	const token = jwt.sign({ user }, "coderhouse123", { expiresIn: '12h' });
	return token;
};
//token admin
console.log(generateToken ({"_id":{"$oid":"65918cda83f031bc9d5f52a9"},"first_name":"Backend","last_name":"Admin","email":"adminCoder@coder.com","rol":"admin","age":{"$numberInt":"55"},"password":"$2b$15$zXXUbmLtTxx57uCsdc5pl.iSya1tpzwZz2fxaDtf9gv/rAMtZTjX.","documents":[],"last_connection":{"$date":{"$numberLong":"1704112034716"}},"cart":{"$oid":"65918cda83f031bc9d5f52aa"},"__v":{"$numberInt":"0"}}));



// export const authToken = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         req.status(401).send("Usuario no autenticado");
//     }
//     const token = authHeader.split(' ')[1];

//     jwt.sign(token, process.env.JWTSECRET, (err, user) => {
//         if (err) {
//             req.status(403).send("Token no valido");
//         }
//         req.user = user;
//         next();
//     })
// }

//new new new export 
export const authToken = (req, res, next) => {
    //Consult header
    const authHeader = req.headers.Authorization //Check if token exists
    if (!authHeader) {
        return res.status(401).send({ error: 'Unauthenticated user' })
    }
    const token = authHeader.split(' ')[1]//Split token into 2 and keep the valid part
    //process.env.JWT_SECRET
    
    jwt.sign(token, process.env.JWT_SECRET, (error, credentials) => {
       
        if (error) {
            return res.status(403).send({ error: 'Unauthorized user' })
        }
        //Decrypt token
        req.user = credentials.user
        console.log(req.user);
        next()
        
    })
}