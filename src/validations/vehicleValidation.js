import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';

const createNew = Joi.object({
  licenePlate: Joi.string().required().trim().strict().pattern(/^[0-9]{2}[A-Z]-[0-9]{4,5}$/),
  type: Joi.string().min(2).max(20).trim().strict().optional(),
});

const create= async (req, res, next) => {
  try {
    await createNew.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message, 'BR_Validate', 'BR_Validate'));
  }
};

export const vehicleValidation = {
  create,
};
