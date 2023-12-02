import Joi, { array, object } from 'joi';
import { ObjectId } from 'mongodb';
import ApiError from '~/utils/ApiError';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { GET_DB } from '~/config/mongodb';
import { parkingModel } from '~/models/parkingModel';

const PARKINGTURN_COLLECTION_NAME = 'parkingTurn';
const PARKINGTURN_COLLECTION_SCHEMA = Joi.object({
  vehicleId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  parkingId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  position: Joi.string().min(4).max(6).trim().strict().required(),

  fee: Joi.number().integer().multiple(1000).required().min(1000),
  start: Joi.date().timestamp('javascript').default(Date.now),
  end: Joi.date().timestamp('javascript').default(null),

  _destroy: Joi.boolean().default(false),
});

const validateBeforOperate = async (data) => {
  return await PARKINGTURN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
  try {
    const validateData = await validateBeforOperate(data);
    validateData.vehicleId = new ObjectId(validateData.vehicleId);
    validateData.parkingId = new ObjectId(validateData.parkingId);
    const checkPosition = await findPosition(validateData);
    if (checkPosition == null) {
      throw new Error('The location already has a car');
    }
    const checkvehicleId = await findvehicleId(validateData);
    if (checkvehicleId) {
      throw new Error('The car is already in the parking lot');
    }
    const createNew = await GET_DB()
      .collection(PARKINGTURN_COLLECTION_NAME)
      .insertOne(validateData);
    if (createNew.acknowledged == false) {
      throw new ApiError('Error');
    }
    const update = await GET_DB()
      .collection(parkingModel.PARKING_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(validateData.parkingId), 'slots.position': validateData.position },
        {
          $inc: { occupied: 1 },
          $set: {
            'slots.$.parkingTurnId': createNew.insertedId,
            'slots.$.isBlank': false,
          },
        },
      );
    if (update.acknowledged == false) {
      throw new ApiError('Error');
    }
    return createNew;
  } catch (error) {
    throw new Error(error);
  }
};

const updateOut = async (filter) => {
  try {
    const updateOut = await GET_DB()
      .collection(PARKINGTURN_COLLECTION_NAME)
      .findOneAndUpdate(filter, { $set: { end: Date.now(), _destroy: true } });
    const update = await GET_DB()
      .collection(parkingModel.PARKING_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(updateOut.parkingId), 'slots.position':  updateOut.position },
        {
          $inc: { occupied: -1 },
          $set: {
            'slots.$.parkingTurnId': null,
            'slots.$.isBlank': true,
          },
        },
      );
    if (update.acknowledged == false) {
      throw new ApiError('Error');
    }
    return updateOut;
  } catch (error) {
    throw new Error(error);
  }
};

const findvehicleId = async (data) => {
  try {
    const findvehicleId = await GET_DB()
      .collection(PARKINGTURN_COLLECTION_NAME)
      .findOne({ vehicleId: new ObjectId(data.vehicleId), _destroy: false }); // KẾt quả trả về là xe nằm trong bãi
    return findvehicleId;
  } catch (error) {
    throw new Error(error);
  }
};

const findPosition = async (data) => {
  try {
    // const findPosition = await GET_DB().collection(PARKINGTURN_COLLECTION_NAME).findOne({ 'parkingId' : data.parkingId, 'position' : data.position, '_destroy' : false })
    const findPosition = await GET_DB()
      .collection(parkingModel.PARKING_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(data.parkingId),
        slots: {
          $elemMatch: {
            position: data.position,
            isBlank: true,
          },
        },
      });
    return findPosition;
  } catch (error) {
    throw new Error(error);
  }
};

const getVehicleInOutNumber = async (startDate, endDate) => {
  try {
    const start = Date.parse(parseDate(startDate));
    const end = Date.parse(parseDate(endDate));
    const getVehicleInOutNumber = await GET_DB()
      .collection(PARKINGTURN_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            start: {
              $gte: start,
              $lte: end,
            },
          },
        },
        {
          $lookup: {
            from: parkingModel.PARKING_COLLECTION_NAME,
            localField: 'parkingId',
            foreignField: '_id',
            as: 'parking',
          },
        },
        {
          $unwind: '$parking',
        },
        {
          $addFields: {
            timezoneOffset: { $literal: new Date().getTimezoneOffset() * 60 * 1000 },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: { $add: [{ $toDate: '$start' }, '$timezoneOffset'] } },
              month: { $month: { $add: [{ $toDate: '$start' }, '$timezoneOffset'] } },
              day: { $dayOfMonth: { $add: [{ $toDate: '$start' }, '$timezoneOffset'] } },
              zone: '$parking.zone',
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day',
            },
            data: {
              $push: {
                k: '$_id.zone',
                v: '$count',
              },
            },
            total: { $sum: '$count' },
          },
        },
        {
          $project: {
            _id: 0,
            date: {
              $dateToString: {
                format: '%d/%m/%Y',
                date: {
                  $dateFromParts: {
                    year: '$_id.year',
                    month: '$_id.month',
                    day: '$_id.day',
                  },
                },
              },
            },
            data: { $arrayToObject: '$data' },
            total: 1,
          },
        },
      ]);
    return await getVehicleInOutNumber.toArray();
  } catch (error) {
    throw new Error(error);
  }
};

const parseDate = (str) => {
  const parts = str.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1] - 1, 10); // Trừ 1 vì tháng bắt đầu từ 0
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  return null; // Trả về null nếu chuỗi không hợp lệ
};

export const parkingTurnModel = {
  PARKINGTURN_COLLECTION_NAME,
  PARKINGTURN_COLLECTION_SCHEMA,
  createNew,
  updateOut,
  getVehicleInOutNumber,
};
