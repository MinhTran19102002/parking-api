import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';

const VEHICLE_COLLECTION_NAME = 'vehicles';
const VEHICLE_COLLECTION_SCHEMA = Joi.object({
  // boadId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)

  driverId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null),

  licenePlate: Joi.string().required().trim().strict().pattern(/^[0-9]{2}[A-Z]-[0-9]{4,5}$/),
  type: Joi.string().min(2).max(20).trim().strict().default('Car'),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});

const validateBeforCreate = async (data) => {
  return await VEHICLE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
  try {
    if (data.driverId) {
      data.driverId = data.driverId.toString();
    }
    const validateData = await validateBeforCreate(data);
    if (validateData.driverId) {
      validateData.driverId = new ObjectId(validateData.driverId);
    }
    const check = await findOneByLicenePlate(data.licenePlate);
    if (check) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe đã tồn tại', 'Not FOUND', 'BR_vihicle_4');
    }
    const createNew = await GET_DB().collection(VEHICLE_COLLECTION_NAME).insertOne(validateData);
    return createNew;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const findOneByLicenePlate = async (licenePlate) => {
  try {
    const findVihecle = await GET_DB()
      .collection(VEHICLE_COLLECTION_NAME)
      .findOne({ licenePlate: licenePlate });
    return findVihecle;
  } catch (error) {
    throw new Error(error);
  }
};

const updateDriverId = async (id, driverId) => {
  try {
    const update = await GET_DB()
      .collection(VEHICLE_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(id) }, { $set: { driverId: new ObjectId(driverId) } });
    return update;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOne = async (id) => {
  try {
    const deleteOne = await GET_DB()
      .collection(VEHICLE_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(id) }, { $set: { driverId: null } });
    return deleteOne;
  } catch (error) {
    throw new Error(error);
  }
};

export const vehicleModel = {
  VEHICLE_COLLECTION_NAME,
  VEHICLE_COLLECTION_SCHEMA,
  createNew,
  findOneByLicenePlate,
  deleteOne,
  updateDriverId,
};
