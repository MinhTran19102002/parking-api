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
  licenePlate: Joi.string().required().trim().strict().pattern(/^[0-9]{2}[A-Z]-[0-9]{4,5}$/),
});


const create = async (req, res, next) => {
  try {
    await createPakingTurn.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message, 'BR_Validate', 'BR_Validate'));
  }
};

const createWithoutPosition = async (req, res, next) => {
  try {
    await createPakingTurnWithoutPosition.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message, 'BR_Validate', 'BR_Validate'));
  }
};

const createWithoutZoneAndPosition = async (req, res, next) => {
  try {
    await createPakingTurnWithoutZoneAndPosition.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message, 'BR_Validate', 'BR_Validate'));
  }
};

export const parkingTurnValidation = {
  create,
  createWithoutPosition,
  createWithoutZoneAndPosition,
};
