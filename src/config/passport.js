import local from 'passport-local'; // Estrategia
import passport from 'passport'; // Manejador de las estrategias
import GithubStrategy from 'passport-github2';
import { createHash, validatePassword } from '../utils/bcrypt.js';
import userModel from '../models/users.models.js';
const localStrategy = local.Strategy;

const initializePassport = () => {
    // Register
    passport.use('register', new localStrategy(
        // Done --> símil res.status() -->  callback de respuesta
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            //Defino como voy a registrar un usuario
            const { first_name, last_name, email, age } = req.body
            try {
                const user = await userModel.findOne({ email: email })
                if (user) {
                    
                    return done(null, false,)
                }
                const passwordHash = createHash(password)
                const userCreated = await userModel.create({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    age: age,
                    password: passwordHash
                })
                console.log(userCreated)
                return done(null, userCreated)
            } catch (error) {
                return done(error)
            }
        }
    ))
    //Passport - Mediante terceros - GITHUB
    passport.use('github', new GithubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(accessToken)
            console.log(refreshToken)
            const user = await userModel.findOne({ email: profile._json.email })
            if (!user) {
                const userCreated = await userModel.create({
                    first_name: profile._json.name,
                    last_name: ' ',
                    email: profile._json.email,
                    age: 18, // Desconocemos, default = 18
                    password: 'password'
                })
                done(null, userCreated)
            } else {
                done(null, user)

            }
        } catch (error) {
            done(error)
        }
    }))
    // Login
    passport.use('login', new localStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })
            if (!user) {
                done(null, false, { message: 'User not found' })//Usuario no encontrado
            }
            if (validatePassword(password, user.password)) {
                return done(null, user)//Usuario y contrasena validos
            }
            //Else -> Contrasena no validas
            return done(null, false, { message: 'Invalid password' })//Contrasena invalida
        } catch (error) {
            return done(error)
        }
    }))
    //Inicializar sesion del usuario
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    //Eliminar sesion del usuario
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport