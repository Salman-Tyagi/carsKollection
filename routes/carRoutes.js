import express from 'express';
import * as carController from '../controller/carController.js';
import carValidation from '../validation/carValidation.js';
import * as authController from '../controller/authController.js';

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictedTo('user'),
    carController.getAllCars
  )
  .post(carValidation, carController.createCar);

export default router;
