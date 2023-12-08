import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';

const createPakingTurn = Joi.object({
  licenePlate: Joi.string().required().min(6).max(20).trim().strict(),
  zone: Joi.string().required().min(1).max(2).trim().strict(),
  position: Joi.string().min(4).max(6).trim().strict().required(),
});
const createPakingTurnWithoutPosition = Joi.object({
  licenePlate: Joi.string().required().min(6).max(20).trim().strict(),
  zone: Joi.string().required().min(1).max(2).trim().strict(),
});
const createPakingTurnWithoutZoneAndPosition = Joi.object({
  licenePlate: Joi.string().required().min(6).max(20).trim().strict(),
});


const create = async (req, res, next) => {
  try {
    await createPakingTurn.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};

const createWithoutPosition = async (req, res, next) => {
  try {
    await createPakingTurnWithoutPosition.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};

const createWithoutZoneAndPosition = async (req, res, next) => {
  try {
    await createPakingTurnWithoutZoneAndPosition.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};

export const parkingTurnValidation = {
  create,
  createWithoutPosition,
  createWithoutZoneAndPosition,
};
