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

  name: Joi.string().required().min(6).max(50).trim().strict(),
  address: Joi.string().required().min(6).max(50).trim().strict(),
  phone: Joi.string().required().min(10).max(11).trim().strict(),
  email: Joi.string().required().min(6).max(50).trim().strict(),

  account: Joi.object({
    username: Joi.string().required().min(6).max(30).trim().strict(),
    password: Joi.string().required().min(20).max(100).trim().strict(),
    role: Joi.string().required().min(3).max(20).trim().strict(),
  }).optional(),

  driver: Joi.object({
    vehicleId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  }).optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});

const createDriver = async (data, licenePlate) => {
  try {
    const vehicle = await vehicleModel.findOneByLicenePlate(licenePlate);
    if (!vehicle) {
      throw new Error('LicenePlate already exists');
    }
    data.driver = { vehicleId: vehicle._id.toString() };
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
      throw new Error('Update error!');
    }
    return createNew;
  } catch (error) {
    throw new Error(error);
  }
};

const validateBeforCreate = async (data) => {
  return await PERSON_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
  try {
    const validateData = await validateBeforCreate(data);
    const check = await findOne(data.account);
    if (check) {
      throw new Error('Username already exists');
    }
    const createNew = await GET_DB().collection(PERSON_COLLECTION_NAME).insertOne(validateData);
    return createNew;
  } catch (error) {
    throw new Error(error);
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
    throw new Error(error);
  }
};

const findOne = async (data) => {
  try {
    const findUser = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .findOne({ 'account.username': data.username });
    return findUser;
  } catch (error) {
    throw new Error(error);
  }
};

const findByID = async (id) => {
  try {
    const objectId = new ObjectId(id);
    return await GET_DB().collection(PERSON_COLLECTION_NAME).findByID(objectId);
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
  for (const [key, value] of Object.entries(params)) {
    const regex = {
      [key]: new RegExp(`^${value}`, 'i'),
    };
    Object.assign(paramMatch, regex);
  }

  try {
    const driver = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            driver: { $exists: true },
            ...paramMatch,
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

    let totalCount = driver.length;
    let totalPage = 1;
    let newDriver = driver;

    if (pageSize && pageIndex) {
      totalPage = Math.ceil(totalCount / pageSize);
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

const findUsers = async ({ pageSize, pageIndex, ...params }) => {
  // Construct the regular expression pattern dynamically
  let paramMatch = {};
  for (const [key, value] of Object.entries(params)) {
    const regex = {
      [key]: new RegExp(`^${value}`, 'i'),
    };
    Object.assign(paramMatch, regex);
  }

  try {
    let pipeline = [
      {
        $match: {
          account: { $exists: true },
          ...paramMatch,
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

const updateUser = async (_id, _data) => {
  _data.updatedAt = Date.now();
  const data = validateBeforCreate(_data);
  data.updatedAt = Date.now();
  delete data._id;
  try {
    const updateOperation = {
      $set: {
        ...data,
      },
    };

    const result = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(_id) }, updateOperation);

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUser = async (_id) => {
  try {
    const result = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .deleteOne(
        { _id: new ObjectId(_id) },
        { returnDocument: 'after' },
        { locale: 'vi', strength: 1 },
      );

    // const result = await GET_DB()
    //   .collection(PERSON_COLLECTION_NAME)
    //   .updateOne(
    //     { _id: new ObjectId(_id) },
    //     {
    //       $set: {
    //         _destroy: true,
    //       },
    //     },
    //     { returnDocument: 'after' },
    //     { locale: 'vi', strength: 1 },
    //   );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteAll = async (_ids) => {
  try {
    const result = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .deleteMany(
        { account: { $exists: true } },
        { returnDocument: 'after' },
        { locale: 'vi', strength: 1 },
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteMany = async (_ids) => {
  try {
    const result = await GET_DB()
      .collection(PERSON_COLLECTION_NAME)
      .deleteMany(
        { name: { $exists: false } },
        { returnDocument: 'after' },
        { locale: 'vi', strength: 1 },
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const userModel = {
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
  findDriverByFilter,
};
