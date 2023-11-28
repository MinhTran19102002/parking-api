import Joi, { array, object } from 'joi';
import { ObjectId } from 'mongodb';
import ApiError from '~/utils/ApiError';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { GET_DB } from '~/config/mongodb';
import { parkingTurnModel } from '~/models/parkingTurnModel';

const PARKING_COLLECTION_NAME = 'parking';
const PARKING_COLLECTION_SCHEMA = Joi.object({
  zone: Joi.string().required().min(1).max(2).trim().strict(),
  description: Joi.string().max(100).trim().strict(),
  total: Joi.number().strict().default(0),
  occupied: Joi.number().strict().default(0),
  slots: Joi.array()
    .items({
      position: Joi.string().min(4).max(6).trim().strict().required(),
      parkingTurnId: Joi.string()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE)
        .default(null),
      isBlank: Joi.boolean().default(true),
    })
    .min(1)
    .unique('position')
    .required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});

const validateBeforOperate = async (data) => {
  data.occupied = data.slots.filter((item) => item.isBlank === false).length;
  data.total = data.slots.length;
  return await PARKING_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
  try {
    const validateData = await validateBeforOperate(data);
    const check = await findOne(data.zone);
    if (check) {
      throw new Error('Zone already exists');
    }
    const createNew = await GET_DB().collection(PARKING_COLLECTION_NAME).insertOne(validateData);
    return createNew;
  } catch (error) {
    throw new Error(error);
  }
};

const findOne = async (zone) => {
  try {
    const findZoon = await GET_DB().collection(PARKING_COLLECTION_NAME).findOne({ zone: zone });
    return findZoon;
  } catch (error) {
    throw new Error(error);
  }
};

const getStatus = async (zone) => {
  try {
    const getStatus = await GET_DB()
      .collection(PARKING_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            zone: zone,
          },
        },
        {
          $lookup: {
            from: parkingTurnModel.PARKINGTURN_COLLECTION_NAME,
            localField: 'slots.parkingTurnId',
            foreignField: '_id',
            as: 'parkingTurn',
          },
        },
        {
          $unwind: '$slots',
        },
        {
          $project: {
            _id: 1,
            zone: 1,
            description: 1,
            total: 1,
            occupied: 1,
            'slots.position': 1,
            'slots.parkingTurnId': 1,
            'slots.isBlank': 1,
            'slots.vehicle': {
              $cond: {
                if: { $eq: ['$slots.parkingTurnId', null] },
                then: null,
                else: '$parkingTurn',
              },
            },
          },
        },
      ]);
    return await getStatus.toArray();
  } catch (error) {
    throw new Error(error);
  }
};

export const parkingModel = {
  PARKING_COLLECTION_NAME,
  PARKING_COLLECTION_SCHEMA,
  createNew,
  findOne,
  getStatus,
};
