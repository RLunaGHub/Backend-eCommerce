import bcrypt from 'bcrypt';

export const createHash = password =>
	bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT)));

export const validatePassword = (passwordSended, passwordBBDD) =>
	bcrypt.compareSync(passwordSended, passwordBBDD);