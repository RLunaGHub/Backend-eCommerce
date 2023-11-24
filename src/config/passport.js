import local from 'passport-local' 
import passport from 'passport' 
import GithubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import { createHash, validatePassword } from '../utils/bcrypt.js'
import userModel from '../models/users.models.js'
import { generateUserErrorInfo } from '../services/errors/info.js';
import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/enums.js';
import logger from '../utils/loggers.js'

const localStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const initializePassport = () => {

    const cookieExtractor = req => {
        console.log(req.cookies)
        const token = req.cookies ? req.cookies.jwtCookie : {}
        return token
    }
    
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), 
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => {
        try {
            console.log(jwt_payload);
            return done(null, jwt_payload) //contenido del token
        } catch (error) {
            logger.error(`[ERROR] - Date: ${new Date().toLocaleTimeString()} - ${error.message}`)
            return done(error)
        }
    }))
    
    passport.use('register', new localStrategy(
        //done es como un res.status(), callback de respuesta
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            
            const { first_name, last_name, email, age } = req.body
            if (!first_name || !last_name || !email || !age || !password) {
                CustomError.createError({
                    name: 'Error al crear usuario',
                    cause: generateUserErrorInfo({
                        first_name,
                        last_name,
                        email,
                        age,
                        password,
                    }),
                    message: 'Error al crear usuario',
                    code: EErrors.MISSING_OR_INVALID_USER_DATA,
                });
            }
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
                req.user = userCreated;
                return done(null, userCreated)
            } catch (error) {
                return done(error)
            }
        }
    ))
    
    passport.use('github', new GithubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await userModel.findOne({ email: profile._json.email })
            if (!user) {
                const hashPassword = createHash('password')
                const userCreated = await userModel.create({
                    first_name: profile._json.name,
                    last_name: ' ',
                    email: profile._json.email,
                    age: 18, //Edad por defecto,
                    password: hashPassword,
                })
                logger.info('User created')
                done(null, userCreated)

            } else {
                logger.info('User already exists')
                done(null, user)
            }

        } catch (error) {
            logger.error(error)
            done(error)
        }
    }))
    
    passport.use('login', new localStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })
            if (!user) {
                done(null, false, { message: 'User not found' })
            }
            if (validatePassword(password, user.password)) {
                return done(null, user)
            }
            
            return done(null, false, { message: 'Invalid password' })
        } catch (error) {
            return done(error)
        }
    }))
    
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport