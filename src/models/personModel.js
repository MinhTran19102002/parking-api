import Joi from 'joi'
import {OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE} from '~/utils/validators'

const PERSON_COLLECTION_NAME = 'persons'
const PERSON_COLLECTION_SCHEMA = Joi.object({
  // boadId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)

  name: Joi.string().required().min(6).max(50).trim().strict(),
  adress: Joi.string().required().min(6).max(20).trim().strict(),
  phone: Joi.string().required().min(10).max(11).trim().strict(),
  email: Joi.string().required().min(6).max(30).trim().strict(),

  user: Joi.object({
    username: Joi.string().required().min(6).max(20).trim().strict(),
    password: Joi.string().required().min(8).max(20).trim().strict(),
    role: Joi.string().required().min(3).max(20).trim().strict()
  }).optional(),

  driver: Joi.object({
    vihecleId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  }).optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

export const userModel = {
  PERSON_COLLECTION_NAME,
  PERSON_COLLECTION_SCHEMA
}