import Joi, { array, object } from 'joi';
import { ObjectId } from 'mongodb';
import ApiError from '~/utils/ApiError';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { GET_DB } from '~/config/mongodb';
import { parkingTurnModel } from '~/models/parkingTurnModel';
import { vehicleModel } from '~/models/vehicleModel';
import { personModel } from '~/models/personModel';
import { StatusCodes } from 'http-status-codes';

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
      throw new ApiError(StatusCodes.NOT_FOUND, 'Khu vực không được tìm thấy', 'Not Found', 'BR_zone_1');
    }
    const createNew = await GET_DB().collection(PARKING_COLLECTION_NAME).insertOne(validateData);
    return createNew;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
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
          $lookup: {
            from: 'parkingTurn',
            localField: 'slots.parkingTurnId',
            foreignField: '_id',
            as: 'slots.parkingTurn',
          },
        },
        {
          $unwind: {
            path: '$slots.parkingTurn',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: vehicleModel.VEHICLE_COLLECTION_NAME,
            localField: 'slots.parkingTurn.vehicleId',
            foreignField: '_id',
            as: 'slots.parkingTurn.vehicles',
          },
        },
        {
          $unwind: {
            path: '$slots.parkingTurn.vehicles',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: personModel.PERSON_COLLECTION_NAME,
            localField: 'slots.parkingTurn.vehicles.driverId',
            foreignField: '_id',
            as: 'slots.parkingTurn.persons',
          },
        },
        {
          $unwind: {
            path: '$slots.parkingTurn.persons',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            'slots.parkingTurn.persons': {
              $ifNull: ['$slots.parkingTurn.persons', null],
            },
          },
        },
        {
          $group: {
            _id: '$_id',
            zone: { $first: '$zone' },
            description: { $first: '$description' },
            total: { $first: '$total' },
            occupied: { $first: '$occupied' },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
            _destroy: { $first: '$_destroy' },
            parkingTurn: { $first: '$parkingTurn' },
            slots: {
              $push: {
                position: '$slots.position',
                isBlank: '$slots.isBlank',
                parkingTurn: '$slots.parkingTurn',
              },
            },
          },
        },
        // {
        //   $addFields: {
        //     timezoneOffset: { $literal: new Date().getTimezoneOffset() * 60 * 1000 },
        //   },
        // },
        {
          $project: {
            _id: 0,
            zone: 1,
            description: 1,
            total: 1,
            occupied: 1,
            // createdAt:  {
            //   $dateToString: {
            //     date: {
            //       $subtract: [
            //         { $toDate: '$createdAt' },
            //         '$timezoneOffset',
            //       ],
            //     },
            //     format: '%d/%m/%Y %H:%M:%S',
            //   },
            // },
            createdAt: 1,
            updatedAt: 1,
            _destroy: 1,
            slots: {
              $filter: {
                input: {
                  $map: {
                    input: '$slots',
                    as: 'slot',
                    in: {
                      position: '$$slot.position',
                      isBlank: '$$slot.isBlank',
                      parkingTurn: {
                        vehicleInfo: '$$slot.parkingTurn.vehicleInfo',
                        driverInfo: '$$slot.parkingTurn.personInfo',
                        position: '$$slot.parkingTurn.position',
                        fee: '$$slot.parkingTurn.fee',
                        _destroy: '$$slot.parkingTurn._destroy',
                        start: '$$slot.parkingTurn.start',
                        end: '$$slot.parkingTurn.end',
                        vehicles: '$$slot.parkingTurn.vehicles',
                        persons :'$$slot.parkingTurn.persons',
                      },
                    },
                  },
                },
                as: 'slot',
                cond: { $ne: ['$$slot.isBlank', true] },
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
