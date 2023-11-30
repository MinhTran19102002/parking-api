import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';

const VEHICLE_COLLECTION_NAME = 'vehicles';
const VEHICLE_COLLECTION_SCHEMA = Joi.object({
  // boadId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)

  driverId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null),

  licenePlate: Joi.string().required().min(6).max(20).trim().strict(),
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
    const validateData = await validateBeforCreate(data);
    const check = await findOneByLicenePlate(data.licenePlate);
    if (check) {
      throw new Error('Vehicle already exists');
    }
    const createNew = await GET_DB().collection(VEHICLE_COLLECTION_NAME).insertOne(validateData);
    return createNew;
  } catch (error) {
    throw new Error(error);
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

const deleteOne = async (id) => {
  try {
    const deleteOne = await GET_DB()
      .collection(VEHICLE_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });
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
};
