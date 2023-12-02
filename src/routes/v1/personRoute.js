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

Router.route('/addMany').post(userController.createMany);
Router.route('/deleteMany').post(userController.deleteMany);
Router.route('/deleteAll').delete(userController.deleteAll);

Router.route('/driver').post(userController.createDriver).get(userController.findDriver).put(userController.updateDriver).delete(userController.deleteDriver);

Router.route('/driver/deletes').delete(userController.deleteDrivers);

Router.route('/driver/filter').get(userController.findDriverByFilter);

Router.route('/employee')
  .get(userController.findUsers)
  .post(userValidation.createNew, userController.createNew)
  .put(userController.updateUser);

export const userRoute = Router;
