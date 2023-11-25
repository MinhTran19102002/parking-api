import { StatusCodes } from 'http-status-codes';
import { userService } from '~/services/personService';
import bcrypt from 'bcrypt';

const createNew = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const createUser = await userService.createUser(req.body);

    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    next(error);
  }
};

const createDriver = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const createDriver = await userService.createDriver(req.body);

    res.status(StatusCodes.CREATED).json(createDriver);
  } catch (error) {
    next(error);
  }
};
const findDriver = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const findDriver = await userService.findDriver();

    res.status(StatusCodes.CREATED).json(findDriver);
  } catch (error) {
    next(error);
  }
};

const findUsers = async (req, res, next) => {
  try {
    //get param
    const { pageSize, pageIndex, name } = req.query;

    // Dieu huong sang tang Service
    const users = await userService.findUsers();
    res.status(StatusCodes.CREATED).json(users);
  } catch (error) {
    next(error);
  }
};

export const userController = {
  createNew,
  createDriver,
  findDriver,
  findUsers
};
