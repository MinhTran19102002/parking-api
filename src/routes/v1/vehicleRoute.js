import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { vehicleController } from '~/controllers/vehicleController';

const Router = express.Router();


Router.route('/vehicle')
  .post(vehicleController.createNew);

export const vehicleRoute = Router;
