import { Router } from 'express';
import passport from 'passport';
import usersController from '../controllers/users.controller.js';
import multer from 'multer';

const upload = multer({ dest: 'documents/' });

const routerUser = Router();

routerUser.post('/', passport.authenticate('register'), usersController.postUser);
routerUser.get('/', usersController.getUser);
routerUser.post('/recovery', usersController.passwordRecovery);
routerUser.post('/resetpassword/:token', usersController.passwordReset);
routerUser.post('/:uid/documents', upload.array('documents'), usersController.uploadDocuments);
routerUser.delete('/:uid', usersController.deleteUser);

export default routerUser;



