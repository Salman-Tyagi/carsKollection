import express from 'express';
import userValidation from '../validation/userValidation.js';
import * as authController from '../controller/authController.js';
import passwordEncrypt from '../utils/passwordEncrypt.js';

const router = express.Router();

router.post('/signup', userValidation, passwordEncrypt, authController.signup);
router.post('/login', authController.login);

router.patch(
  '/update-password',
  authController.protect,
  passwordEncrypt,
  authController.updatePassword
);

router.patch('/logout', authController.logout);

export default router;
