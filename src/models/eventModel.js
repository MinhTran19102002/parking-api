import Joi, { array, object } from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';

const EVENT_COLLECTION_NAME = 'event';
const EVENT_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(1).max(50).trim().strict(),
  eventId : Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  createdAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});

const validateBeforCreate = async (data) => {
  return await EVENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createEvent = async (data) => {
  try {
    data.eventId = data.eventId.toString()
    const validateData = await validateBeforCreate(data);
    validateData.eventId = new ObjectId(validateData.eventId)
    validateData.createdAt = data.createdAt
    const createNew = await GET_DB().collection(EVENT_COLLECTION_NAME).insertOne(validateData);
    return createNew;
  } catch (error) {
    throw new Error(error);
  }
};


export const eventModel = {
  EVENT_COLLECTION_NAME,
  EVENT_COLLECTION_SCHEMA,
  createEvent,
}