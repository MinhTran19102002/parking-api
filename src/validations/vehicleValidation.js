import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';

const createNew = Joi.object({
  licenePlate: Joi.string().required().min(6).max(20).trim().strict(),
  type: Joi.string().min(2).max(20).trim().strict().optional(),
});

const create= async (req, res, next) => {
  try {
    await createNew.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};

export const vehicleValidation = {
  create,
};
