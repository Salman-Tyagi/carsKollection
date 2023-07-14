import express from 'express';
import * as carController from '../controller/carController.js';
import carValidation from '../validation/carValidation.js';

const router = express.Router();

router
  .route('/')
  .get(carController.getAllCars)
  .post(carValidation, carController.createCar);

export default router;
