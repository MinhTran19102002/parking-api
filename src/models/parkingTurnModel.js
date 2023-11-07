import Joi, { array, object } from 'joi'
import { ObjectId } from 'mongodb'
import ApiError from '~/utils/ApiError'
import {OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE} from '~/utils/validators'
import {GET_DB} from '~/config/mongodb'
import { StatusCodes } from 'http-status-codes'

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

export const parkingTurnModel = {
  PARKINGTURN_COLLECTION_NAME,
  PARKINGTURN_COLLECTION_SCHEMA,
  createNew,
  updateOut
}