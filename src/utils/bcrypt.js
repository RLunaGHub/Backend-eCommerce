import bcrypt from 'bcrypt';

// Encriptar contraseña
export const createHash = password =>
	bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT)));
// Validar contraseña encriptada
export const validatePassword = (passwordSended, passwordBBDD) =>
	bcrypt.compareSync(passwordSended, passwordBBDD);