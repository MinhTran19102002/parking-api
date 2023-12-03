import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';

const validatePassword = Joi.string()
  .required()
  .min(8)
  .max(50)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
  .messages({
    'string.min': 'Password must be at least 8 characters long.',
    'string.max': 'Password must not exceed 50 characters.',
    'string.pattern.base':
      'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, and 1 special character.',
    'any.required': 'Password is required.',
  })
  .trim()
  .strict();

const account = Joi.object({
  username: Joi.string().required().min(6).max(20).trim().strict(),
  password: validatePassword,
  role: Joi.string().required().min(3).max(20).trim().strict(),
});

const base = Joi.object().keys({
  name: Joi.string().required().min(6).max(50).trim().strict(),
  address: Joi.string().min(6).max(50).trim().strict(),
  phone: Joi.string().required().min(10).max(11).trim().strict().pattern(/(0[3|5|7|8|9])+([0-9]{8})\b/),
  email: Joi.string()
    .required()
    .email({ tlds: { allow: false } })
    .min(6)
    .max(30)
    .trim()
    .strict(),
});

const user = base.keys({
  account: account.required(),
});

const login = async (req, res, next) => {
  const correctCondition = Joi.object({
    username: Joi.string().required().min(6).max(50).trim().strict(),
    password: Joi.string().required().min(8).max(20).trim().strict(),
    role: Joi.string().required().min(3).max(20).trim().strict(),
  });
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};

const createNew = async (req, res, next) => {
  try {
    await user.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};

const valid = async (req, res, next) => {
  try {
    await user.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};

const validateToUpdate = async (req, res, next) => {
  const updateSchema = user.object().keys({
    account: account.optional(),
  });
  try {
    await updateSchema.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};

export const userValidation = {
  login,
  createNew,
  valid,
  validateToUpdate,
};
