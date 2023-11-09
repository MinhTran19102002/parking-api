import Joi, { array, object } from 'joi'
import { ObjectId } from 'mongodb'
import ApiError from '~/utils/ApiError'
import {OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE} from '~/utils/validators'
import {GET_DB} from '~/config/mongodb'
import { StatusCodes } from 'http-status-codes'
import {parkingModel} from '~/models/parkingModel'

const PARKINGTURN_COLLECTION_NAME = 'parkingTurn'
const PARKINGTURN_COLLECTION_SCHEMA = Joi.object({
  vehicleId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  parkingId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  position: Joi.string().min(5).max(6).trim().strict().required(),

  fee: Joi.number().integer().multiple(1000).required().min(1000),
  start: Joi.date().timestamp('javascript').default(Date.now),
  end: Joi.date().timestamp('javascript').default(null),

  _destroy: Joi.boolean().default(false)
})

const validateBeforOperate = async (data) => {
  return await PARKINGTURN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
}

const createNew = async (data) => {
  try {
    const validateData = await validateBeforOperate(data)
    validateData.vehicleId = new ObjectId(validateData.vehicleId)
    validateData.parkingId = new ObjectId(validateData.parkingId)
    const checkPosition = await findPosition(data)
    if (checkPosition) {
      throw new Error('The location already has a car')
    }
    const checkvehicleId = await findvehicleId(data)
    if (checkvehicleId) {
      throw new Error('The car is already in the parking lot')
    }
    const createNew = await GET_DB().collection(PARKINGTURN_COLLECTION_NAME).insertOne(validateData)
    return createNew
  } catch (error) {
    throw new Error(error)
  }
}

const findvehicleId = async (data) => {
  try {
    const findvehicleId = await GET_DB().collection(PARKINGTURN_COLLECTION_NAME).findOne({ 'vehicleId' : data.vehicleId, '_destroy' : false })
    return findvehicleId
  } catch (error) {
    throw new Error(error)
  }
}

const findPosition = async (data) => {
  try {
    const findPosition = await GET_DB().collection(PARKINGTURN_COLLECTION_NAME).findOne({ 'parkingId' : data.parkingId, 'position' : data.position, '_destroy' : false})
    return findPosition
  } catch (error) {
    throw new Error(error)
  }
}

const updateOut = async (filter) => {
  try {
    const updateOut = await GET_DB().collection(PARKINGTURN_COLLECTION_NAME).updateOne(filter, { $set: { end : Date.now(), _destroy : true } })
    return updateOut
  } catch (error) {
    throw new Error(error)
  }
}
const getVehicleInOutNumber = async (startDate, endDate) => {
  try {
    const start = Date.parse(parseDate(startDate))
    const end = Date.parse(parseDate(endDate))
    const getVehicleInOutNumber = await GET_DB().collection(PARKINGTURN_COLLECTION_NAME).aggregate([
      {
        $match: {
          'start': {
            $gte: start,
            $lte: end
          }
        }
      },
      {
        $lookup: {
          from : parkingModel.PARKING_COLLECTION_NAME,
          localField : 'parkingId',
          foreignField : '_id',
          as : 'parking'
        }
      },
      {
        $unwind: '$parking'
      },
      {
        $group: {
          _id: {
            year: { $year: { $toDate: '$start' } },
            month: { $month: { $toDate: '$start' } },
            day: { $dayOfMonth: { $toDate: '$start' } },
            zone: '$parking.zone'
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString:
            {
              format: '%d/%m/%Y',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: '$_id.day'
                }
              }
            }
          },
          zone : '$_id.zone',
          count: 1
        }
      }
    ])
    return await getVehicleInOutNumber.toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const parseDate = (str) => {
  const parts = str.split('/')
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1] - 1, 10) // Trừ 1 vì tháng bắt đầu từ 0
    const year = parseInt(parts[2], 10)
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day)
    }
  }
  return null // Trả về null nếu chuỗi không hợp lệ
}

export const parkingTurnModel = {
  PARKINGTURN_COLLECTION_NAME,
  PARKINGTURN_COLLECTION_SCHEMA,
  createNew,
  updateOut,
  getVehicleInOutNumber
}