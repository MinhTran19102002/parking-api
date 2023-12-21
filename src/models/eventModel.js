import Joi, { array, object } from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { parkingModel } from './parkingModel';
import { parkingTurnModel } from './parkingTurnModel';
import { vehicleModel } from './vehicleModel';
import { personModel } from './personModel';

const EVENT_COLLECTION_NAME = 'event';
const EVENT_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(1).max(50).trim().strict(),
  zone: Joi.string().optional().min(1).max(2).trim().strict(),
  eventId: Joi.string().optional().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  createdAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});

const validateBeforCreate = async (data) => {
  return await EVENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createEvent = async (data) => {
  try {
    if (data.eventId) {
      data.eventId = data.eventId.toString();
    }
    const validateData = await validateBeforCreate(data);
    if (data.eventId) {
      validateData.eventId = new ObjectId(validateData.eventId);
    }
    validateData.createdAt = data.createdAt;
    const createNew = await GET_DB().collection(EVENT_COLLECTION_NAME).insertOne(validateData);
    return createNew;
  } catch (error) {
    throw new Error(error);
  }
};

const findEvent = async ({ pageSize, pageIndex, ...params }) => {
  // Construct the regular expression pattern dynamically
  let paramMatch = {};
  try {
    const event = await GET_DB()
      .collection(EVENT_COLLECTION_NAME)
      .aggregate([
        {
          $sort: {
            createdAt: -1, // sắp xếp theo thứ tự giảm dần của trường thoi_gian
          },
        },
        {
          $lookup: {
            from: parkingTurnModel.PARKINGTURN_COLLECTION_NAME,
            localField: 'eventId',
            foreignField: '_id',
            as: 'parkingTurn',
          },
        },
        // {
        //   $unwind: '$parkingTurn',
        // },
        {
          $unwind: {
            path: '$parkingTurn',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: vehicleModel.VEHICLE_COLLECTION_NAME,
            localField: 'parkingTurn.vehicleId',
            foreignField: '_id',
            as: 'vehicle',
          },
        },
        // {
        //   $unwind: '$vehicle',
        // },
        {
          $unwind: {
            path: '$vehicle',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: personModel.PERSON_COLLECTION_NAME,
            localField: 'vehicle.driverId',
            foreignField: '_id',
            as: 'person',
          },
        },
        {
          $unwind: {
            path: '$person',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            person: {
              $ifNull: ['$person', null],
            },
          },
        },
        {
          $lookup: {
            from: parkingModel.PARKING_COLLECTION_NAME,
            localField: 'parkingTurn.parkingId',
            foreignField: '_id',
            as: 'parking',
          },
        },
        // {
        //   $unwind: '$parking',
        // },
        {
          $unwind: {
            path: '$parking',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            name: 1,
            createdAt: 1,
            // zone: '$parking.zone',
            zone: {
              $ifNull: ['$parking.zone', '$zone'],
            },
            parkingTurn: {
              position: '$parkingTurn.position',
              fee: '$parkingTurn.fee',
              start: '$parkingTurn.start',
              end: '$parkingTurn.end',
            },

            vehicle: {
              licenePlate: '$vehicle.licenePlate',
              type: '$vehicle.type',
              driverId: '$vehicle.driverId',
            },
            person: 1,
          },
        },
      ])
      .toArray();
    if (event.person) {
      delete event.person.driver;
      delete event.person.createdAt;
      delete event.person.updatedAt;
      delete event.person._destroy;
    }
    let totalCount = event.length;
    let totalPage = 1;
    let newEvent = event;

    if (pageSize && pageIndex) {
      totalPage = Math.ceil(totalCount / pageSize);
      newEvent = newEvent.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    }
    return {
      data: newEvent,
      totalCount,
      totalPage,
    };
  } catch (error) {
    throw new Error(error);
  }
};



const exportEvent = async ({ pageSize, pageIndex, ...params }) => {
  // Construct the regular expression pattern dynamically
  let paramMatch = {};
  try {
    const event = await GET_DB()
      .collection(EVENT_COLLECTION_NAME)
      .aggregate([
        {
          $sort: {
            createdAt: -1, // sắp xếp theo thứ tự giảm dần của trường thoi_gian
          },
        },
        {
          $lookup: {
            from: parkingTurnModel.PARKINGTURN_COLLECTION_NAME,
            localField: 'eventId',
            foreignField: '_id',
            as: 'parkingTurn',
          },
        },
        {
          $unwind: '$parkingTurn',
        },
        {
          $lookup: {
            from: vehicleModel.VEHICLE_COLLECTION_NAME,
            localField: 'parkingTurn.vehicleId',
            foreignField: '_id',
            as: 'vehicle',
          },
        },
        {
          $unwind: '$vehicle',
        },
        {
          $lookup: {
            from: personModel.PERSON_COLLECTION_NAME,
            localField: 'vehicle.driverId',
            foreignField: '_id',
            as: 'person',
          },
        },
        {
          $unwind: {
            path: '$person',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            person: {
              $ifNull: ['$person', null],
            },
          },
        },
        {
          $lookup: {
            from: parkingModel.PARKING_COLLECTION_NAME,
            localField: 'parkingTurn.parkingId',
            foreignField: '_id',
            as: 'parking',
          },
        },
        {
          $unwind: '$parking',
        },
        {
          $project: {
            _id: 0,
            name: 1,
            createdAt: 1,
            zone: '$parking.zone',
            parkingTurn: {
              position: '$parkingTurn.position',
              fee: '$parkingTurn.fee',
              start: '$parkingTurn.start',
              end: '$parkingTurn.end',
            },

            vehicle: {
              licenePlate: '$vehicle.licenePlate',
              type: '$vehicle.type',
              driverId: '$vehicle.driverId',
            },
            person: 1,
          },
        },
      ])
      .toArray();
    if (event.person) {
      delete event.person.driver;
      delete event.person.createdAt;
      delete event.person.updatedAt;
      delete event.person._destroy;
    }
    let totalCount = event.length;
    let totalPage = 1;
    let newEvent = event;

    if (pageSize && pageIndex) {
      totalPage = Math.ceil(totalCount / pageSize);
      newEvent = newEvent.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    }
    return {
      data: newEvent,
      totalCount,
      totalPage,
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const eventModel = {
  EVENT_COLLECTION_NAME,
  EVENT_COLLECTION_SCHEMA,
  createEvent,
  findEvent,
  exportEvent,
};
