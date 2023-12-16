import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { vehicleController } from '~/controllers/vehicleController';
import { verifyTokenMidleware } from '~/middlewares/verifytokenMidleware';
import { vehicleValidation } from '~/validations/vehicleValidation';

const Router = express.Router();


Router.route('/vehicle')
  .post(vehicleValidation.create, verifyTokenMidleware.verifyTokenAndManager,vehicleController.createNew);

export const vehicleRoute = Router;
