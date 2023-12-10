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

const changePassword = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const changePassword = await userService.changePassword(req, res);
    res.status(StatusCodes.CREATED).json(changePassword);
  } catch (error) {
    next(error);
  }
};

const createMany = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const createUser = await userService.createMany(req.body);
    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    next(error);
  }
};

const createManyDriver = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const createUser = await userService.createManyDriver(req.body);
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

const findEmployees = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const users = await userService.findUsers({ ...req.query, role: 'Employee' });
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

const deleteAll = async (req, res, next) => {
  try {
    const rs = await userService.deleteAll();
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

const deleteMany = async (req, res, next) => {
  try {
    const rs = await userService.deleteMany(req.body);
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

const updateDriver = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const updateDriver = req.body;
    const rs = await userService.updateDriver(req.query._id, updateDriver);
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

const deleteDriver = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const _idDelete = req.query._id;
    const rs = await userService.deleteDriver(_idDelete);
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

const deleteDrivers = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const ids = req.body.ids;
    const rs = await userService.deleteDrivers(ids);
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

const findDriverByFilter = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const rs = await userService.findDriverByFilter(req.query);
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

export const userController = {
  createNew,
  createMany,
  createManyDriver,
  createDriver,
  findDriver,
  findUsers,
  findEmployees,
  updateUser,
  findByID,
  deleteUser,
  deleteMany,
  deleteAll,
  findDriverByFilter,
  updateDriver,
  deleteDriver,
  deleteDrivers,
  changePassword,
};
