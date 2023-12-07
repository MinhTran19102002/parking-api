/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatter';
import { personModel } from '~/models/personModel';
import { vehicleModel } from '~/models/vehicleModel';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '~/config/environment';
import express from 'express';

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      username: user.account.username,
      role: user.account.role,
    },
    env.JWT_ACCESS_KEY,
    { expiresIn: '2h' },
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      username: user.account.username,
      role: user.account.role,
    },
    env.JWT_REFRESH_KEY,
    { expiresIn: '2d' },
  );
};

const login = async (req, res) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = req.body;
    const findOne = await personModel.findOne(data);
    if (!findOne) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not exist');
    }
    const validatePasword = await bcrypt.compare(data.password, findOne.account.password);
    if (!validatePasword) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Password is wrong');
    }
    const accessToken = generateAccessToken(findOne);
    const refreshToken = generateRefreshToken(findOne);
    console.log('Access:   ' + accessToken)
    console.log('refreshToken:   ' + refreshToken)
    delete findOne.account.password;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      sercure: false,
      sametime: 'strict',
    });
    // const { account: { password,  }, ...userLogin } = findOne
    return { person: findOne, accessToken };
  } catch (error) {
    throw error;
  }
};

const changePassword = async (req, res) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = req.body;
    const findOne = await personModel.findOne(data);
    if (!findOne) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Người dùng không tồn tại');
    }
    const validatePasword = await bcrypt.compare(data.password, findOne.account.password);
    if (!validatePasword) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Mật khẩu không chính xác');
    }
    const newPassword = await hashPassword(data.newPassword);
    console.log(findOne.account.password)
    findOne.account.password = newPassword;
    console.log(findOne.account.password)
    const updatePassword = await personModel.updateUser(findOne._id, findOne);
    return updatePassword;
  } catch (error) {
    throw error;
  }
};

const createUser = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const hashed = await hashPassword(data.account.password);
    data.account.password = hashed;
    const createUser = await personModel.createNew(data);
    if (createUser.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'User is not created');
    }
    return createUser;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const createMany = async (_data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = await Promise.all(
      _data.map(async (el) => {
        const hashed = await hashPassword(el.account.password);
        el.account.password = hashed;
        return el;
      }),
    );
    const createUser = await personModel.createMany(data);
    if (createUser.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'User is not created');
    }
    return createUser;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const createDriver = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // const licenePlate = data.licenePlate;
    // delete data.licenePlate;
    let {licenePlate, job, department, ...other} = data
    let vehicle = await vehicleModel.findOneByLicenePlate(licenePlate);
    if (!vehicle) {
      vehicle = await vehicleModel.createNew({ licenePlate });
    }
    const createDriver = await personModel.createDriver(other, licenePlate, job, department);
    if (createDriver.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'User is not created');
    }
    return createDriver;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const findByID = async (_id) => {
  try {
    const users = await personModel.findByID(_id);
    if (users.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Users not exist');
    }
    return users;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const findDriver = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const findDriver = await personModel.findDriver();
    if (findDriver.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Driver not exist');
    }
    return findDriver;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const findDriverByFilter = async (filter) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const findDriver = await personModel.findDriverByFilter(filter);
    if (findDriver.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Driver not exist');
    }
    return findDriver;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const findUsers = async (params) => {
  try {
    let role;
    if (params.role) {
      role = params.role;
      delete params.role;
    }
    const users = await personModel.findUsers(params, role);
    if (users.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Users not exist');
    }
    return users;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateUser = async (_id, params) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const users = await personModel.updateUser(_id, params);
    if (users.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'User not exist');
    }
    return users;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateDriver = async (_id, params) => {
  // eslint-disable-next-line no-useless-catch
  try {
    let {licenePlate, job, department, ...other} = params
    const users = await personModel.updateDriver(_id, other, licenePlate, job, department);
    if (users.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'User not exist');
    }
    return users;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteDriver = async (_idDelete) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const users = await personModel.deleteDriver(_idDelete);
    if (users.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Deletion failed');
    }
    return users;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteDrivers = async (ids) => {
  // eslint-disable-next-line no-useless-catch
  try {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'The IDs array is invalid or empty.');
    }
    const users = await personModel.deleteDrivers(ids);
    // if (users.acknowledged == false) {
    //   throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Deletion failed');
    // }
    return users;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookie.refreshToken;
    if (!refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authenticated');
    }
    //

    jwt.verify(refreshToken, env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authenticated');
      }
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        path: '/',
        sercure: false,
        sametime: 'strict',
      });
      return newAccessToken;
    });
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (_id) => {
  try {
    const users = await personModel.deleteUser(_id);
    if (users.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Delete failure');
    }
    return users;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteAll = async () => {
  try {
    const users = await personModel.deleteAll();
    if (users.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Delete failure');
    }
    return users;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteMany = async (params) => {
  try {
    const users = await personModel.deleteMany(params);
    if (users.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Delete failure');
    }
    return users;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const userService = {
  login,
  createUser,
  createMany,
  refreshToken,
  createDriver,
  findDriver,
  findUsers,
  findByID,
  updateUser,
  deleteUser,
  deleteMany,
  deleteAll,
  findDriverByFilter,
  updateDriver,
  deleteDriver,
  deleteDrivers,
  changePassword,
};
