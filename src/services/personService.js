/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatter';
import { userModel } from '~/models/personModel';
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
      username: user.user.username,
    },
    env.JWT_ACCESS_KEY,
    { expiresIn: '2h' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      username: user.user.username,
    },
    env.JWT_REFRESH_KEY,
    { expiresIn: '2d' }
  );
};

const login = async (req, res) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = req.body;
    const findOne = await userModel.findOne(data);
    if (!findOne) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not exist');
    }
    const validatePasword = await bcrypt.compare(data.password, findOne.user.password);
    if (!validatePasword) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Password is wrong');
    }
    const accessToken = generateAccessToken(findOne);
    const refreshToken = generateRefreshToken(findOne);
    delete findOne.user.password;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      sercure: false,
      sametime: 'strict',
    });
    // const { user: { password,  }, ...userLogin } = findOne
    return { person: findOne, accessToken };
  } catch (error) {
    throw error;
  }
};

const createUser = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const hashed = await hashPassword(data.user.password);

    data.user.password = hashed;
    const createUser = await userModel.createNew(data);
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
    const licenePlate = data.licenePlate;
    delete data.licenePlate;
    const createDriver = await userModel.createDriver(data, licenePlate);
    if (createDriver.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'User is not created');
    }
    return createDriver;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const findDriver = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const findDriver = await userModel.findDriver();
    if (findDriver.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Driver not exist');
    }
    return findDriver;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const findUsers = async (params) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const users = await userModel.findUsers(params);
    if (users.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Users not exist');
    }
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

export const userService = {
  login,
  createUser,
  refreshToken,
  createDriver,
  findDriver,
  findUsers,
};