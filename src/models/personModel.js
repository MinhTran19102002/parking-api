import Joi from 'joi';
import { ObjectId } from 'mongodb';
import ApiError from '~/utils/ApiError';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { GET_DB } from '~/config/mongodb';
import { StatusCodes } from 'http-status-codes';
import { vehicleModel } from '~/models/vehicleModel';

const PERSON_COLLECTION_NAME = 'persons';
const PERSON_COLLECTION_SCHEMA = Joi.object({
  // boadId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)

  name: Joi.string()
    .required()
    .min(4)
    .max(50)
    .trim()
    .strict()
    .pattern(/^[^\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/)
    .message('Họ và tên không được phép có ký tự và số'),
  address: Joi.string().min(6).max(50).trim().strict(),
  phone: Joi.string().required().min(10).max(11).trim().strict(),
  email: Joi.string().required().min(4).max(50).trim().strict(),

  account: Joi.object({
    username: Joi.string()
      .required()
      .min(4)
      .max(30)
      .trim()
      .strict()
      .disallow(' ')
      .pattern(/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]+$/)
      .message('Username không cho phép chữ có dấu, khoảng trắng'),
    password: Joi.string().required().min(20).max(100).trim().strict(),
    role: Joi.string().required().min(3).max(20).trim().strict(),
  }).optional(),

  driver: Joi.object({
    vehicleId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    job: Joi.string().required().min(4).max(50).trim().strict(),
    department: Joi.string().required().min(4).max(50).trim().strict(),
  }).optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});

const validateBeforCreate = async (data) => {
  return await PERSON_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createDriver = async (data, licenePlate, job, department) => {
  try {
    const vehicle = await vehicleModel.findOneByLicenePlate(licenePlate);
    if (!vehicle) {
      // xe da duoc tao o service neu xe chua ton tai
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Biển số chưa tồn tại',
        'Not Found',
        'BR_person_1',
      );
    }
    if (vehicle.driverId != null) {
      // xe da co chu
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Xe đã có chủ',
        'Not Found',
        'BR_person_1',
      );
    }
    data.driver = { vehicleId: vehicle._id.toString(), job: job, department: department };
    const validateData = await validateBeforCreate(data);
    validateData.driver.vehicleId = new ObjectId(validateData.driver.vehicleId);
    const createNew = await GET_DB().collection(PERSON_COLLECTION_NAME).insertOne(validateData);
    const updateVihecle = await GET_DB()
      .collection(vehicleModel.VEHICLE_COLLECTION_NAME)
      .updateOne(
        { _id: validateData.driver.vehicleId },
        { $set: { driverId: createNew.insertedId } },
      );
    if (updateVihecle.modifiedCount == 0) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Cập nhật không thành công',
        'Not Found',
        'BR_person_1',
      );
    }
    return createNew;
  } catch (error) {
    console.log(error.message)
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else if (error.message.includes('E11000 duplicate key')) {
      throw new ApiError(error.statusCode, 'Trùng SĐT hoặc gmail', 'Email_1', 'Email_1');
    } else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const createNew = async (data) => {
  try {
    const validateData = await validateBeforCreate(data);
    const check = await findOne(data.account);
    if (check) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Người dùng đã tồn tại',
        'Not Found',
        'BR_person_1',
      );
    }
    const createNew = await GET_DB().collection(PERSON_COLLECTION_NAME).insertOne(validateData);
    return createNew;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else if (error.message.includes('E11000 duplicate key')) {
      throw new ApiError(error.statusCode, 'Trùng SĐT hoặc gmail', 'Email_1', 'Email_1');
    } else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const createMany = async (_data) => {
  try {
    const data = await Promise.all(
      _data.map(async (el) => {
        const rs = await validateBeforCreate(el);
        return rs;
      }),
    );

    // const noValid = await data.some(async (el) => {
    //   const rs = await findOne(el.account);
    //   return rs;
    // });

    // if (noValid) {
    //   throw new Error('Cant create this user list, beacuse there are usernames already exists');
    // }

    const createNew = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .insertMany(data, { ordered: true });
    return createNew;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const findOne = async (data) => {
  try {
    const findUser = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .findOne({ 'account.username': data.username, 'account.role': data.role });
    return findUser;
  } catch (error) {
    throw new Error(error);
  }
};

const findByID = async (id) => {
  try {
    const objectId = new ObjectId(id);
    return await GET_DB().collection(PERSON_COLLECTION_NAME).findOne({ _id: objectId });
  } catch (error) {
    throw new Error(error);
  }
};

const findDriver = async () => {
  try {
    const findDriver = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            driver: { $exists: true },
          },
        },
        {
          $lookup: {
            from: vehicleModel.VEHICLE_COLLECTION_NAME,
            localField: 'driver.vehicleId',
            foreignField: '_id',
            as: 'driver.vehicle',
          },
        },
      ])
      .toArray();
    return findDriver;
  } catch (error) {
    throw new Error(error);
  }
};

const findDriverByFilter = async ({ pageSize, pageIndex, ...params }) => {
  // Construct the regular expression pattern dynamically
  let paramMatch = {};
  for (let [key, value] of Object.entries(params)) {
    if (key == 'licenePlate') {
      key = 'driver.vehicle.' + key; //driver.vehicle.licenePlate
    }
    let regex;
    if (key == 'name') {
      regex = {
        [key]: new RegExp(`${value}`, 'i'),
      };
    } else {
      regex = {
        [key]: new RegExp(`^${value}`, 'i'),
      };
    }
    Object.assign(paramMatch, regex);
  }
  try {
    const driver = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            driver: { $exists: true },
          },
        },
        {
          $sort: {
            createdAt: -1, // sắp xếp theo thứ tự giảm dần của trường thoi_gian
          },
        },
        {
          $lookup: {
            from: vehicleModel.VEHICLE_COLLECTION_NAME,
            localField: 'driver.vehicleId',
            foreignField: '_id',
            as: 'driver.vehicle',
          },
        },
        {
          $match: {
            ...paramMatch,
          },
        },
      ])
      .toArray();

    let totalCount = driver.length;
    let totalPage = 1;
    let newDriver = driver;

    if (pageSize && pageIndex) {
      pageSize = Number(pageSize);
      pageIndex = Number(pageIndex);
      if (pageSize != 10 && pageSize != 20 && pageSize != 30) pageSize = 10;
      // eslint-disable-next-line use-isnan
      if (pageIndex < 1 || isNaN(pageIndex)) pageIndex = 1;
      totalPage = Math.ceil(totalCount / pageSize);
      if (pageIndex > totalPage) pageIndex = totalPage;
      newDriver = newDriver.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    }
    return {
      data: newDriver,
      totalCount,
      totalPage,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const findUsers = async ({ pageSize, pageIndex, ...params }, role) => {
  // Construct the regular expression pattern dynamically
  let paramMatch = {};
  for (const [key, value] of Object.entries(params)) {
    let regex;
    if (key == 'name') {
      regex = {
        [key]: new RegExp(`${value}`, 'i'),
      };
    } else {
      regex = {
        [key]: new RegExp(`^${value}`, 'i'),
      };
    }
    Object.assign(paramMatch, regex);
  }

  const checkRole = role ? { 'account.role': role } : { account: { $exists: true } };
  try {
    let pipeline = [
      {
        $match: {
          ...checkRole,
          ...paramMatch,
        },
      },
      {
        $sort: {
          createdAt: -1, // sắp xếp theo thứ tự giảm dần của trường thoi_gian
        },
      },
    ];
    let query = await GET_DB().collection(PERSON_COLLECTION_NAME);
    const allUsers = await query.aggregate(pipeline).toArray();
    let totalCount = allUsers.length;
    let totalPage = 1;

    if (pageSize && pageIndex) {
      pageSize = Number(pageSize);
      pageIndex = Number(pageIndex);
      if (pageSize != 10 && pageSize != 20 && pageSize != 30) pageSize = 10;
      if (pageIndex < 1 || isNaN(pageIndex)) pageIndex = 1;
      pipeline.push(
        {
          $skip: pageSize * (pageIndex - 1),
        },
        { $limit: pageSize },
      );
      totalPage = Math.ceil(totalCount / pageSize);
    }

    const users = await query.aggregate([...pipeline]).toArray();

    return {
      data: users,
      totalCount,
      totalPage,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const updateDriver = async (_id, data, licenePlate, job, department) => {
  delete data._id;
  data.updatedAt = Date.now();
  const findDriver = await GET_DB()
    .collection(PERSON_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(_id) });
  if (!findDriver) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Không tìm thấy người',
      'Not FOUND',
      'BR_vihicle_4',
    );
  }
  const findVehicleOfDataUpdate = await GET_DB()
    .collection(vehicleModel.VEHICLE_COLLECTION_NAME)
    .findOne({ licenePlate: licenePlate });
  let vehicleId = findDriver.driver.vehicleId.toString();

  if (findVehicleOfDataUpdate == null) {
    //Neu xe khong ton tai
    const createVehicle = await vehicleModel.createNew({
      licenePlate: licenePlate,
      type: 'Car',
      driverId: findDriver._id,
    });
    vehicleId = createVehicle.insertedId.toString();
    await vehicleModel.deleteOne(findDriver.driver.vehicleId);
  } else if (findVehicleOfDataUpdate.driverId == null) {
    //Neu xe ton tai nhung chua co chu
    const update = await vehicleModel.updateDriverId(findVehicleOfDataUpdate._id, findDriver._id);
    vehicleId = findVehicleOfDataUpdate._id.toString();
    await vehicleModel.deleteOne(findDriver.driver.vehicleId);
  } else if (!findVehicleOfDataUpdate.driverId.equals(findDriver._id)) {
    //Neu xe ton tai nhung co chu khac roi
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Xe có chủ rồi bà',
      'Not FOUND',
      'BR_vihicle_4',
    );
  } else if (findVehicleOfDataUpdate.driverId.equals(findDriver._id)) {
    //Neu xe ton tai va la xe cua chu nay
    vehicleId = findVehicleOfDataUpdate._id.toString();
  }
  data = {
    ...data,
    createdAt: findDriver.createdAt,
    driver: { job: job, department: department, vehicleId: vehicleId },
  };

  let validateData = await validateBeforCreate(data);
  validateData.updatedAt = Date.now();
  validateData.createdAt = findDriver.createdAt;
  validateData.driver.vehicleId = new ObjectId(vehicleId);
  try {
    const updateOperation = {
      $set: {
        ...validateData,
      },
    };
    const result = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(_id) }, updateOperation, { returnDocument: 'after' });
    return result;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else if (error.message.includes('Plan executor error during findAndModify')) {
      throw new ApiError(error.statusCode, 'Trùng SĐT hoặc gmail', 'Email_1', 'Email_1');
    } else {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

const deleteDriver = async (_id) => {
  try {
    const driver = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(_id), driver: { $exists: true } });
    if (driver) {
      if (driver.driver.vehicleId) {
        const updateId = await GET_DB()
          .collection(vehicleModel.VEHICLE_COLLECTION_NAME)
          .updateOne({ _id: new ObjectId(driver.driver.vehicleId) }, { $set: { driverId: null } });
      }
    } else {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Người lái không tồn tại',
        'Not',
        'BR_vihicle_4',
      );
    }
    const result = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(_id) });
    return result;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteDrivers = async (_ids) => {
  try {
    //update lai nhung xe co Id la nguoi dung muon xa tro thanh xe khong chu
    const objectIds = _ids.map((_ids) => new ObjectId(_ids));
    const updateId = await GET_DB()
      .collection(vehicleModel.VEHICLE_COLLECTION_NAME)
      .updateMany({ driverId: { $in: objectIds } }, { $set: { driverId: null } });
    const result = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .deleteMany({ _id: { $in: objectIds }, driver: { $exists: true } });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const updateUser = async (_id, _data) => {
  _data.updatedAt = Date.now();
  delete _data._id;
  const data = await validateBeforCreate(_data);
  delete data.createdAt;
  data.updatedAt = Date.now();
  try {
    const updateOperation = {
      $set: {
        ...data,
      },
    };
    const result = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(_id) }, updateOperation, { returnDocument: 'after' });

    return result;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else if (error.message.includes('Plan executor error during findAndModify')) {
      throw new ApiError(error.statusCode, 'Trùng SĐT hoặc gmail', 'Email_1', 'Email_1');
    } else {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

const deleteUser = async (_id, role) => {
  try {
    const result = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .deleteOne(
        { _id: new ObjectId(_id), 'account.role': role },
        { returnDocument: 'after' },
        { locale: 'vi', strength: 1 },
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteAll = async () => {
  try {
    const result = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .deleteMany(
        { account: { $exists: true }, 'account.usename': { $ne: 'admin' } },
        { returnDocument: 'after' },
        { locale: 'vi', strength: 1 },
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteMany = async ({ ids }) => {
  try {
    const objectIds = ids.map((id) => new ObjectId(id));
    const updateId = await GET_DB()
      .collection(vehicleModel.VEHICLE_COLLECTION_NAME)
      .updateMany({ driverId: { $in: objectIds } }, { $set: { driverId: null } });

    const result = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .deleteMany(
        { _id: { $in: objectIds }, 'account.role': 'Manager' },
        { returnDocument: 'after' },
        { locale: 'vi', strength: 1 },
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteManyEmployee = async ({ ids }) => {
  try {
    const objectIds = ids.map((id) => new ObjectId(id));

    const result = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .deleteMany(
        { _id: { $in: objectIds }, account: { $exists: false }, driver: { $exists: false } },
        { returnDocument: 'after' },
        { locale: 'vi', strength: 1 },
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const findEmployees = async ({ pageSize, pageIndex, ...params }) => {
  // Construct the regular expression pattern dynamically
  let paramMatch = {};
  for (const [key, value] of Object.entries(params)) {
    let regex;
    if (key == 'name') {
      regex = {
        [key]: new RegExp(`${value}`, 'i'),
      };
    } else {
      regex = {
        [key]: new RegExp(`^${value}`, 'i'),
      };
    }
    Object.assign(paramMatch, regex);
  }

  try {
    let pipeline = [
      {
        $match: {
          ...paramMatch,
          driver: { $exists: false },
          account: { $exists: false },
        },
      },
      {
        $sort: {
          createdAt: -1, // sắp xếp theo thứ tự giảm dần của trường thoi_gian
        },
      },
    ];
    let query = await GET_DB().collection(PERSON_COLLECTION_NAME);
    const allUsers = await query.aggregate(pipeline).toArray();
    let totalCount = allUsers.length;
    let totalPage = 1;

    if (pageSize && pageIndex) {
      pageSize = Number(pageSize);
      pageIndex = Number(pageIndex);
      if (pageSize != 10 && pageSize != 20 && pageSize != 30) pageSize = 10;
      if (pageIndex < 1 || isNaN(pageIndex)) pageIndex = 1;
      pipeline.push(
        {
          $skip: pageSize * (pageIndex - 1),
        },
        { $limit: pageSize },
      );
      totalPage = Math.ceil(totalCount / pageSize);
    }

    const users = await query.aggregate([...pipeline]).toArray();

    return {
      data: users,
      totalCount,
      totalPage,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const createEmployee = async (data) => {
  try {
    const validateData = await validateBeforCreate(data);
    const createNew = await GET_DB().collection(PERSON_COLLECTION_NAME).insertOne(validateData);
    return createNew;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else if (error.message.includes('E11000 duplicate key')) {
      throw new ApiError(error.statusCode, 'Trùng SĐT hoặc gmail', 'Email_1', 'Email_1');
    } else {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

const updateEmployee = async (_id, _data) => {
  _data.updatedAt = Date.now();
  delete _data._id;
  const data = await validateBeforCreate(_data);
  delete data.createdAt;
  data.updatedAt = Date.now();
  try {
    const updateOperation = {
      $set: {
        ...data,
      },
    };
    const result = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(_id) }, updateOperation, { returnDocument: 'after' });

    return result;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else if (error.message.includes('Plan executor error during findAndModify')) {
      throw new ApiError(error.statusCode, 'Trùng SĐT hoặc gmail', 'Email_1', 'Email_1');
    } else {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

const deleteAllEmployee = async () => {
  try {
    const result = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .deleteMany(
        { account: { $exists: false }, driver: { $exists: false } },
        { returnDocument: 'after' },
        { locale: 'vi', strength: 1 },
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteEmployee = async (_id) => {
  try {
    const result = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .deleteOne(
        { _id: new ObjectId(_id), account: { $exists: false }, driver: { $exists: false } },
        { returnDocument: 'after' },
        { locale: 'vi', strength: 1 },
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const personModel = {
  PERSON_COLLECTION_NAME,
  PERSON_COLLECTION_SCHEMA,
  findOne,
  findByID,
  createNew,
  createMany,
  createDriver,
  findDriver,
  findUsers,
  updateUser,
  deleteUser,
  deleteMany,
  deleteAll,
  findDriverByFilter,
  updateDriver,
  deleteDriver,
  deleteDrivers,
  findEmployees,
  createEmployee,
  updateEmployee,
  deleteAllEmployee,
  deleteEmployee,
  deleteManyEmployee,
};
