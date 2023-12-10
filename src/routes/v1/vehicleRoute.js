import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { vehicleController } from '~/controllers/vehicleController';
import { vehicleValidation } from '~/validations/vehicleValidation';

const Router = express.Router();


Router.route('/vehicle')
  .post(vehicleValidation.create,vehicleController.createNew);

export const vehicleRoute = Router;
