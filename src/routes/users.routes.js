import { Router } from 'express';
import passport from 'passport';
import usersController from '../controllers/users.controller.js';
import multer from 'multer';

const routerUser = Router();
const upload = multer({ dest: 'documents/' });

routerUser.post('/', passport.authenticate('register'), usersController.postUser);

routerUser.get('/', usersController.getUser);
routerUser.post('/api/:uid/documents', upload.array('documents'), usersController.uploadDocuments); 
export default routerUser;



