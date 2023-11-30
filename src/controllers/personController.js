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

    res.status(StatusCodes.OK).json(createDriver);
  } catch (error) {
    next(error);
  }
};
const findDriver = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const findDriver = await userService.findDriver();

    res.status(StatusCodes.OK).json(findDriver);
  } catch (error) {
    next(error);
  }
};

const findUsers = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const users = await userService.findUsers(req.query);
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    next(error);
  }
};

const findByID = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const { _id } = req.query;
    const users = await userService.findByID(_id);
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const newUser = req.body;
    delete newUser.account;
    const rs = await userService.updateUser(req.query._id, newUser);
    res.status(StatusCodes.CREATED).json(rs);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const rs = await userService.deleteUser(req.query._id);
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

export const userController = {
  createNew,
  createDriver,
  findDriver,
  findUsers,
  updateUser,
  findByID,
  deleteUser,
};
