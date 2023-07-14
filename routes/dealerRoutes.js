import express from 'express';
import * as dealerController from '../controller/dealerController.js';
import dealerValidation from '../validation/dealerValidation.js';
import passwordEncrypt from '../utils/passwordEncrypt.js';

const router = express.Router();

router
  .route('/')
  .get(dealerController.getAllDealers)
  .post(dealerValidation, passwordEncrypt, dealerController.createDealer);

export default router;
