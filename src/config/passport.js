import local from 'passport-local' 
import passport from 'passport' 
import GithubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import { createHash, validatePassword } from '../utils/bcrypt.js'
import userModel from '../models/users.models.js'
import logger from '../utils/loggers.js'
import 'dotenv/config'


const localStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const initializePassport = () => {
    const cookieExtractor = req => {
        const token = req.cookies ? req.cookies.jwtCookie : {};
        logger.info(token)
        return token;
    } 
   
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => {
        try {
            return done ( null, jwt_payload );
        } catch (error) {
            return done ( error );
        }
    }));

    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { first_name, last_name, email, age, rol } = req.body

            try {
                const user = await userModel.findOne({ email: email })
                if (user) {
                    return done(null, false)
                }
                const passwordHash = createHash(password)
                const userCreated = await userModel.create({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    age: age,
                    rol:rol,
                    password: passwordHash
                })
                console.log(userCreated)
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

