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
import { date } from 'joi';

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

// const generateRefreshToken = (user) => {
//   return jwt.sign(
//     {
//       id: user._id,
//       name: user.name,
//       username: user.account.username,
//       role: user.account.role,
//     },
//     env.JWT_REFRESH_KEY,
//     { expiresIn: '2d' },
//   );
// };

const login = async (req, res) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = req.body;
    const findOne = await personModel.findOne(data);
    if (!findOne) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Người dùng không tồn tại',
        'Not Found',
        'BR_person_1',
      );
    }
    const validatePasword = await bcrypt.compare(data.password, findOne.account.password);
    if (!validatePasword) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Mật khẩu không chính xác',
        'Error',
        'BR_person_password_1',
      );
    }
    const accessToken = generateAccessToken(findOne);
    //const refreshToken = generateRefreshToken(findOne);
    delete findOne.account.password;

    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   path: '/',
    //   sercure: false,
    //   sametime: 'strict',
    // });
    // const { account: { password,  }, ...userLogin } = findOne
    return { person: findOne, accessToken };
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const changePassword = async (req, res) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = req.body;
    const findOne = await personModel.findOne(data);
    if (!findOne) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Người dùng không tồn tại',
        'Not Found',
        'BR_person_1',
      );
    }
    const validatePasword = await bcrypt.compare(data.password, findOne.account.password);
    if (!validatePasword) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Mật khẩu không chính xác',
        'Error',
        'BR_person_password_1',
      );
    }
    const newPassword = await hashPassword(data.newPassword);
    findOne.account.password = newPassword;
    const updatePassword = await personModel.updateUser(findOne._id, findOne);
    return updatePassword;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const createUser = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const hashed = await hashPassword(data.account.password);
    data.account.password = hashed;
    const createUser = await personModel.createNew(data);
    if (createUser.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Người dùng tạo không thành công',
        'Not Created',
        'BR_person_2',
      );
    }
    return createUser;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const createUserM = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const hashed = await hashPassword(data.account.password);
    data.account.password = hashed;
    data.account.role = 'Manager';
    const createUser = await personModel.createNew(data);
    if (createUser.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Người dùng tạo không thành công',
        'Not Created',
        'BR_person_2',
      );
    }
    return createUser;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const createMany = async (_data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = await Promise.all(
      _data.map(async (el) => {
        const hashed = await hashPassword(el.account.password);
        el.account.password = hashed;
        el.account.role = 'Manager';
        return el;
      }),
    );
    const createUser = await personModel.createMany(data);
    if (createUser.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'User is not created');
    }
    return createUser;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const createManyDriver = async (_data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    await Promise.allSettled(
      _data.map(async (data) => {
        const create = await createDriver(data);
        return create;
      }),
    )
      .then((results) => {
        results.forEach((result) => {
          console.log(result);
        });
      })
      .catch((error) => {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
      });
    return { message: 'Thành công' };
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const createDriver = async (data) => {
  //sai loi chinh ta
  // eslint-disable-next-line no-useless-catch
  try {
    // const licenePlate = data.licenePlate;
    // delete data.licenePlate;
    let { licenePlate, job, department, ...other } = data;
    let vehicle = await vehicleModel.findOneByLicenePlate(licenePlate);
    if (!vehicle) {
      vehicle = await vehicleModel.createNew({ licenePlate: licenePlate });
      if (vehicle.acknowledged == false) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Xe tạo không thành công',
          'Not Created',
          'BR_vehicle_2',
        );
      }
    }

    const createDriver = await personModel.createDriver(other, licenePlate, job, department);
    if (createDriver.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Người lái xe tạo không thành công',
        'Not Created',
        'BR_person_2_1',
      );
    }
    return createDriver;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const findByID = async (_id) => {
  try {
    const users = await personModel.findByID(_id);
    if (users == null) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Users not exist');
    }
    return users;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const findDriver = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const findDriver = await personModel.findDriver();
    if (findDriver.acknowledged == false) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Người lái xe không tồn tại',
        'Not Found',
        'BR_person_1_1',
      );
    }
    return findDriver;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const findDriverByFilter = async (filter) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const findDriver = await personModel.findDriverByFilter(filter);
    if (findDriver.acknowledged == false) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Người lái xe không tồn tại',
        'Not Found',
        'BR_person_1_1',
      );
    }
    return findDriver;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const findManagerByFilter = async (filter) => {
  // eslint-disable-next-line no-useless-catch
  try {
    let role = 'Manager';
    const findManagerByFilter = await personModel.findUsers(filter, role);
    if (findManagerByFilter.acknowledged == false) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Người quản lý không tồn tại',
        'Not Found',
        'BR_person_1_1',
      );
    }
    return findManagerByFilter;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
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
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Người dùng không tồn tại',
        'Not Found',
        'BR_person_1',
      );
    }
    return users;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateUser = async (_id, params) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const users = await personModel.updateUser(_id, params);
    if (users == null) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Người dùng cập nhật không thành công',
        'Not Updated',
        'BR_person_3',
      );
    }
    return users;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateDriver = async (_id, params) => {
  // eslint-disable-next-line no-useless-catch
  try {
    let { licenePlate, job, department, ...other } = params;
    const driver = await personModel.updateDriver(_id, other, licenePlate, job, department);
    if (driver.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Người lái xe cập nhật không thành công',
        'Not Updated',
        'BR_person_3_1',
      );
    }
    return driver;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteDriver = async (_idDelete) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const users = await personModel.deleteDriver(_idDelete);
    if (users.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Xóa người lái xe không thành công',
        'Not Deleted',
        'BR_person_4_1',
      );
    }
    return users;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteDrivers = async (ids) => {
  // eslint-disable-next-line no-useless-catch
  try {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Mảng ID không hợp lệ hoặc rỗng',
        'Not Valid',
        'BR_array',
      );
    }
    const users = await personModel.deleteDrivers(ids);
    if (users.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Xóa người lái xe không thành công',
        'Not Deleted',
        'BR_person_4_1',
      );
    }
    return users;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

// Đoạn này chưa xài tới
// const refreshToken = async (req, res) => {
//   try {
//     const refreshToken = req.cookie.refreshToken;
//     if (!refreshToken) {
//       throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authenticated');
//     }
//     //

//     jwt.verify(refreshToken, env.JWT_REFRESH_KEY, (err, user) => {
//       if (err) {
//         throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authenticated');
//       }
//       const newAccessToken = generateAccessToken(user);
//       const newRefreshToken = generateRefreshToken(user);
//       res.cookie('refreshToken', newRefreshToken, {
//         httpOnly: true,
//         path: '/',
//         sercure: false,
//         sametime: 'strict',
//       });
//       return newAccessToken;
//     });
//   } catch (error) {
//     throw error;
//   }
// };

const deleteUser = async (_id, role) => {
  try {
    const users = await personModel.deleteUser(_id, role);
    if (users.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Xóa người dùng không thành công',
        'Not Deleted',
        'BR_person_4',
      );
    }
    return users;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteAll = async () => {
  try {
    const users = await personModel.deleteAll();
    if (users.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Xóa người dùng không thành công',
        'Not Deleted',
        'BR_person_4',
      );
    }
    return users;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteMany = async (params) => {
  try {
    const users = await personModel.deleteMany(params);
    if (users.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Xóa người dùng không thành công',
        'Not Deleted',
        'BR_person_4',
      );
    }
    return users;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteManyE = async (params) => {
  try {
    const users = await personModel.deleteManyEmployee(params);
    if (users.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Xóa người dùng không thành công',
        'Not Deleted',
        'BR_person_4',
      );
    }
    return users;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const checkToken = async (req, res) => {
  let user1;
  try {
    const token = req.headers.authorization;
    if (token) {
      const accessToken = token.split(' ')[1];
      jwt.verify(accessToken, env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token không hợp lệ', 'auth', 'BR_auth');
        }
        user1 = user;
      });
      return user1;
    } else {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        { message: 'Bạn chưa được xác thực' },
        { type: 'auth' },
        { code: 'BR_auth' },
      );
    }
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const findEmployees = async (params) => {
  try {
    const users = await personModel.findEmployees(params);
    if (users.acknowledged == false) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Người dùng không tồn tại',
        'Not Found',
        'BR_person_1',
      );
    }
    return users;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const createEmployee = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const createUser = await personModel.createEmployee(data);
    if (createUser.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Tạo nhân viên không thành công',
        'Not Created',
        'BR_person_2',
      );
    }
    return createUser;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateEmployee = async (_id, params) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const users = await personModel.updateEmployee(_id, params);
    if (users == null) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Cập nhật nhân viên không thành công',
        'Not Updated',
        'BR_person_3',
      );
    }
    return users;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const createManyEmployee = async (_data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    await Promise.allSettled(
      _data.map(async (data) => {
        const create = await createEmployee(data);
        return create;
      }),
    )
      .then((results) => {
        results.forEach((result) => {
          console.log(result);
        });
      })
      .catch((error) => {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
      });
    return { message: 'Thành công' };
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteAllEmployee = async () => {
  try {
    const users = await personModel.deleteAllEmployee();
    if (users.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Xóa người dùng không thành công',
        'Not Deleted',
        'BR_person_4',
      );
    }
    return users;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteEmployee = async (_id) => {
  try {
    const users = await personModel.deleteEmployee(_id);
    if (users.deletedCount == 0) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Xóa người dùng không thành công',
        'Not Deleted',
        'BR_person_4',
      );
    }
    return users;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const userService = {
  login,
  createUser,
  createUserM,
  createMany,
  createManyDriver,
  // refreshToken,
  createDriver,
  findDriver,
  findUsers,
  findByID,
  updateUser,
  deleteUser,
  deleteMany,
  deleteAll,
  findDriverByFilter,
  findManagerByFilter,
  updateDriver,
  deleteDriver,
  deleteDrivers,
  changePassword,
  checkToken,
  findEmployees,
  createEmployee,
  updateEmployee,
  createManyEmployee,
  deleteAllEmployee,
  deleteEmployee,
  deleteManyE,
};
