import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { userValidation } from '~/validations/personValidation';
import { userController } from '~/controllers/personController';
import { verifyTokenMidleware } from '~/middlewares/verifytokenMidleware';

const Router = express.Router();

Router.route('/')
  .post(
    userValidation.createNew,
    verifyTokenMidleware.verifyTokenAndAdminManager,
    userController.createNew,
  ) //
  .get(verifyTokenMidleware.verifyTokenAndAdminManager, userController.findUsers)
  .put(verifyTokenMidleware.verifyTokenAndAdminManager, userController.updateUser)
  .delete(verifyTokenMidleware.verifyTokenAndAdminManager, userController.deleteUser);

Router.route('/addMany').post(
  verifyTokenMidleware.verifyTokenAndAdminManager,
  userController.createMany,
);
Router.route('/deleteMany').post(
  verifyTokenMidleware.verifyTokenAndAdminManager,
  userController.deleteMany,
);
Router.route('/deleteAll').delete(
  verifyTokenMidleware.verifyTokenAndAdminManager,
  userController.deleteAll,
);

Router.route('/addManyDriver').post(userController.createManyDriver);

Router.route('/driver')
  .post(userValidation.createDriver, userController.createDriver) //
  .get(verifyTokenMidleware.verifyTokenAndAdminManager, userController.findDriver) //
  .put(
    userValidation.updateDriver,
    verifyTokenMidleware.verifyTokenAndAdminManager,
    userController.updateDriver,
  ) //
  .delete(
    userValidation.deleteDriver,
    verifyTokenMidleware.verifyTokenAndAdminManager,
    userController.deleteDriver,
  ); //

Router.route('/driver/deletes').post(
  verifyTokenMidleware.verifyTokenAndAdminManager,
  userController.deleteDrivers,
);

Router.route('/driver/filter').get(
  verifyTokenMidleware.verifyTokenAndAdminManager,
  userController.findDriverByFilter,
);

Router.route('/employee')
  .get(verifyTokenMidleware.verifyTokenAndAdminManager, userController.findEmployees)
  .post(
    userValidation.createEmployee,
    verifyTokenMidleware.verifyTokenAndAdminManager,
    userController.createEmployee,
  )
  .put(
    userValidation.createEmployee,
    verifyTokenMidleware.verifyTokenAndAdminManager,
    userController.updateEmployee,
  );

Router.route('/changePassword').post(
  userValidation.changePassword,
  verifyTokenMidleware.verifyToken,
  userController.changePassword,
);

export const userRoute = Router;
