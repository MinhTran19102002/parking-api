import Joi from 'joi'
import { ObjectId } from 'mongodb'
import ApiError from '~/utils/ApiError'
import {OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE} from '~/utils/validators'
import {GET_DB} from '~/config/mongodb'
import { StatusCodes } from 'http-status-codes'

const PERSON_COLLECTION_NAME = 'persons'
const PERSON_COLLECTION_SCHEMA = Joi.object({
  // boadId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)

  name: Joi.string().required().min(6).max(50).trim().strict(),
  adress: Joi.string().required().min(6).max(20).trim().strict(),
  phone: Joi.string().required().min(10).max(11).trim().strict(),
  email: Joi.string().required().min(6).max(30).trim().strict(),

  user: Joi.object({
    username: Joi.string().required().min(6).max(30).trim().strict(),
    password: Joi.string().required().min(20).max(100).trim().strict(),
    role: Joi.string().required().min(3).max(20).trim().strict()
  }).optional(),

  driver: Joi.object({
    vihecleId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  }).optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforCreate = async (data) => {
  return await PERSON_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
}

const createNew = async (data) => {
  try {
    const validateData = await validateBeforCreate(data)
    const check = await findOne(data.user)
    if (check) {
      throw new Error('Username already exists')
    }
    const createNew = await GET_DB().collection(PERSON_COLLECTION_NAME).insertOne(validateData)
    return createNew
  } catch (error) {
    throw new Error(error)
  }
}

const findOne = async (data) => {
  try {
    const findUser = await GET_DB().collection(PERSON_COLLECTION_NAME).findOne({ 'user.username': data.username })
    return findUser
  } catch (error) {
    throw new Error(error)
  }
}

const findByID = async (id) => {
  try {
    const objectId = new ObjectId(id)
    return await GET_DB().collection(PERSON_COLLECTION_NAME).findByID(objectId)
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  PERSON_COLLECTION_NAME,
  PERSON_COLLECTION_SCHEMA,
  findOne,
  findByID,
  createNew
}