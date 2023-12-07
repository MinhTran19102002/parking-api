import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';

const Joi = require('joi');
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require('~/utils/validators');

const REFRESHTOKEN_COLLECTION_NAME = 'refreshToken';
const REFRESHTOKEN_COLLECTION_SCHEMA = Joi.object({
  refreshtoken: Joi.string().required(),
  personId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
});

const validateBeforCreate = async (data) => {
  return await REFRESHTOKEN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const findRefreshToken = async (refreshToken, personId) => {
  try {
    const findRefreshToken = await GET_DB()
      .collection(REFRESHTOKEN_COLLECTION_NAME)
      .findOne({ refreshtoken: refreshToken, personId: new Object(personId) });
    return findRefreshToken;
  } catch (error) {
    throw new Error(error);
  }
};

const createRefreshToken = async (refreshToken, personId) => {
  try {
    personId = personId.toString()
    const validators = await validateBeforCreate({refreshToken: refreshToken, personId: personId})
    validators.personId = new ObjectId(validators.personId)
    const createRefreshToken = await GET_DB()
      .collection(REFRESHTOKEN_COLLECTION_NAME)
      .insertOne();
    return createRefreshToken;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteRefreshToken = async (refreshToken) => {
  try {
    const deleteRefreshToken = await GET_DB()
      .collection(REFRESHTOKEN_COLLECTION_NAME)
      .deleteOne({refreshToken: refreshToken});
    return deleteRefreshToken;
  } catch (error) {
    throw new Error(error);
  }
};


export const refreshTokenModel = {
  findRefreshToken,
  createRefreshToken,
  deleteRefreshToken,
};
