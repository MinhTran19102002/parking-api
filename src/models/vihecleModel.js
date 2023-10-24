import Joi from 'joi'
import {OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE} from '~/utils/validators'

const VEHICLE_COLLECTION_NAME = 'vehicles'
const VEHICLE_COLLECTION_SCHEMA = Joi.object({
  // boadId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)

  driverId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  licenePlate: Joi.string().required().min(6).max(20).trim().strict(),
  type: Joi.string().required().min(6).max(20).trim().strict(),


  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

export const vehicleModel = {
  VEHICLE_COLLECTION_NAME,
  VEHICLE_COLLECTION_SCHEMA
}