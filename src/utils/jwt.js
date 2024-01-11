import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
//process.env.JWT_SECRET
	const token = jwt.sign({ user }, process.env.JWT_SECRET , { expiresIn: '12h' });
	return token;
};

export const authToken = (req, res, next) => {
    //Consult header
    const authHeader = req.headers.Authorization 
    if (!authHeader) {
        return res.status(401).send({ error: 'Unauthenticated user' })
    }
    const token = authHeader.split(' ')[1]
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