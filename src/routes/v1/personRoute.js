import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { userValidation } from '~/validations/personValidation';
import { userController } from '~/controllers/personController';
import { verifyTokenMidleware } from '~/middlewares/verifytokenMidleware';

const Router = express.Router();

Router.route('/')
  .post(userValidation.createNew,verifyTokenMidleware.verifyTokenAndAdminManager, userController.createNew) //
  .get(verifyTokenMidleware.verifyTokenAndAdminManager,userController.findUsers)
  .put(verifyTokenMidleware.verifyTokenAndAdminManager, userController.updateUser)
  .delete(verifyTokenMidleware.verifyTokenAndAdminManager, userController.deleteUser);

Router.route('/addMany').post(verifyTokenMidleware.verifyTokenAndAdminManager, userController.createMany);
Router.route('/deleteMany').post(verifyTokenMidleware.verifyTokenAndAdminManager, userController.deleteMany);
Router.route('/deleteAll').delete(verifyTokenMidleware.verifyTokenAndAdminManager, userController.deleteAll);

Router.route('/driver')
  .post(userValidation.createDriver,verifyTokenMidleware.verifyTokenAndAdminManager, userController.createDriver) //
  .get(verifyTokenMidleware.verifyTokenAndAdminManager, userController.findDriver) //
  .put(userValidation.createDriver, verifyTokenMidleware.verifyTokenAndAdminManager, userController.updateDriver) //
  .delete(verifyTokenMidleware.verifyTokenAndAdminManager, userController.deleteDriver);

Router.route('/driver/deletes').post(verifyTokenMidleware.verifyTokenAndAdminManager, userController.deleteDrivers);

Router.route('/driver/filter').get(verifyTokenMidleware.verifyTokenAndAdminManager, userController.findDriverByFilter);

Router.route('/employee')
  .get(verifyTokenMidleware.verifyTokenAndAdminManager, userController.findEmployees)
  .post(userValidation.createNew,verifyTokenMidleware.verifyTokenAndAdminManager, userController.createNew)
  .put(userController.updateUser);

Router.route('/changePassword').post(verifyTokenMidleware.verifyToken, userController.changePassword)

export const userRoute = Router;
