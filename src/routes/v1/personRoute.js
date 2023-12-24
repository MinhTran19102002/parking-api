import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { userValidation } from '~/validations/personValidation';
import { userController } from '~/controllers/personController';
import { verifyTokenMidleware } from '~/middlewares/verifytokenMidleware';

const Router = express.Router();

Router.route('/')
  .post(userValidation.createNew, userController.createNew) //
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

Router.route('/addManyDriver').post(userController.createManyDriver); // tạo nhiều driver

Router.route('/addManyManager').post(userController.createMany); // tạo nhiều manager

Router.route('/driver')
  .post(
    userValidation.createDriver,
    verifyTokenMidleware.verifyTokenAndManager,
    userController.createDriver,
  ) //
  .get(verifyTokenMidleware.verifyTokenAndManager, userController.findDriver) //
  .put(
    userValidation.updateDriver,
    verifyTokenMidleware.verifyTokenAndManager,
    userController.updateDriver,
  ) //
  .delete(
    userValidation.deleteDriver,
    verifyTokenMidleware.verifyTokenAndManager,
    userController.deleteDriver,
  ); //

Router.route('/driver/deletes').post(
  verifyTokenMidleware.verifyTokenAndManager,
  userController.deleteDrivers,
);

Router.route('/driver/filter').get(
  verifyTokenMidleware.verifyTokenAndManager,
  userController.findDriverByFilter,
);

Router.route('/employee')
  .get(verifyTokenMidleware.verifyTokenAndManager, userController.findEmployees)
  .post(
    userValidation.createEmployee,
    verifyTokenMidleware.verifyTokenAndManager,
    userController.createEmployee,
  )
  .put(
    userValidation.createEmployee,
    verifyTokenMidleware.verifyTokenAndManager,
    userController.updateEmployee,
  )
  .delete(
    // verifyTokenMidleware.verifyTokenAndManager,
    userController.deleteEmployee,
  );

Router.route('/employee/deletes').post(
  verifyTokenMidleware.verifyTokenAndManager,
  userController.deleteEmployees,
);

//Sử lý crud của manager
Router.route('/manager')
  .post(
    userValidation.createUser,
    verifyTokenMidleware.verifyTokenAndAdmin,
    userController.createUser,
  ) //
  .get(verifyTokenMidleware.verifyTokenAndAdmin, userController.findManagerByFilter)
  .put(
    userValidation.updateUser,
    verifyTokenMidleware.verifyTokenAndAdmin,
    userController.updateUser,
  )
  .delete(verifyTokenMidleware.verifyTokenAndAdmin, userController.deleteManager);

Router.route('/manager/deletes').post(
  verifyTokenMidleware.verifyTokenAndAdmin,
  userController.deleteManagers,
);

Router.route('/createManyEmployee').post(
  verifyTokenMidleware.verifyTokenAndManager,
  userController.createManyEmployee,
);

Router.route('/deleteAllEmployee').delete(
  verifyTokenMidleware.verifyTokenAndManager,
  userController.deleteAllEmployee,
);

Router.route('/changePassword').post(
  userValidation.changePassword,
  verifyTokenMidleware.verifyToken,
  userController.changePassword,
);

export const userRoute = Router;
