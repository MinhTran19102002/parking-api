import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { userValidation } from '~/validations/userValidation';
import { userController } from '~/controllers/personController';

const Router = express.Router();

Router.route('/')
  .post(userValidation.createNew, userController.createNew)
  .get(userController.findUsers)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

Router.route('/driver').post(userController.createDriver).get(userController.findDriver);

Router.route('/employee')
  .get(userController.findUsers)
  .post(userValidation.createNew, userController.createNew)
  .put(userController.updateUser);

export const userRoute = Router;
