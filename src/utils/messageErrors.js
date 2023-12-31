import passport from 'passport';
export const passportError = strategy => {
	return async (req, res, next) => {
		passport.authenticate(strategy, (error, user, info) => {
			if (error) {
				return next(error);
			}

			if (!user) {
				return res.status(401).send({ error: info.messages ? info.messages : info.toString() }); 
			}

			req.user = user;
			next();
		})(req, res, next);
	};
};


export const authorization = (role) => {

    return async (req, res, next) => {
        //Se vuelve a consultar si el usuario existe dado que: el token puede expirar
        console.log(req.user);
        if (!req.user) {
            return res.status(401).send({ error: 'User no autorizado' })
        }

        //CICLO FOR PARA RECORRER EL ARRAY QUE CREAMOS CON LAS DISTINTAS FUNCIONES DE LOS USUARIOS
        for (let i = 0; i < role.length; i++) {
            if (req.user.role === role[i]) {
                return next() //Retorno next si el usuario tiene alguno de los roles que le pasamos por parametro
            }
        }
        //Si nada se cumple, retornamos un error 403
        return res.status(403).send({ error: 'User no tiene los privilegios necesarios' })
    }
}
