import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

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
  username: Joi.string().required().min(4).max(20).trim().strict().disallow(' ').pattern(/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]+$/).message('Username không cho phép chữ có dấu, khoảng trắng'),
  password: validatePassword,
  role: Joi.string().required().min(3).max(20).trim().strict(),
});

const accountUser = Joi.object({
  username: Joi.string().required().min(4).max(20).trim().strict().disallow(' ').pattern(/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]+$/).message('Username không cho phép chữ có dấu, khoảng trắng'),
  password: validatePassword,
});


const checkPassWord = Joi.object({
  password: validatePassword,
  newPassword: validatePassword,
  role: Joi.string().required().min(3).max(20).trim().strict(),
  username: Joi.string().required().min(4).max(20).trim().strict().disallow(' ').pattern(/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]+$/).message('Username không cho phép chữ có dấu, khoảng trắng'),
})

const base = Joi.object().keys({
  name: Joi.string().required().min(6).max(50).trim().strict().pattern(/^[^\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/).message('Họ và tên không được phép có ký tự và số'),
  address: Joi.string().min(6).max(50).trim().strict(),
  phone: Joi.string()
    .required()
    .min(10)
    .max(11)
    .trim()
    .strict()
    .pattern(/(0[3|5|7|8|9])+([0-9]{8})\b/),
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


const userM = base.keys({
  account: accountUser.required(),
});
const employee = base;

const driver = base.keys({
  licenePlate: Joi.string()
    .required()
    .trim()
    .strict()
    .pattern(/^[0-9]{2}[A-Z]-[0-9]{4,5}$/),
  job: Joi.string().required().min(4).max(50).trim().strict(),
  department: Joi.string().required().min(4).max(50).trim().strict(),
});

const id = Joi.object({
  _id: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message('_id Cần có định dạng kiểu Object Id')
    .required(),
});

const login = async (req, res, next) => {
  const correctCondition = account;
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message, 'BR_Validate', 'BR_Validate'));
  }
};

const createNew = async (req, res, next) => {
  try {
    await user.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message, 'BR_Validate', 'BR_Validate'));
  }
};

const createUser = async (req, res, next) => {
  try {
    await userM.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message, 'BR_Validate', 'BR_Validate'));
  }
};

const createDriver = async (req, res, next) => {
  try {
    await driver.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message, 'BR_Validate', 'BR_Validate'));
  }
};

const updateDriver = async (req, res, next) => {
  try {
    await id.validateAsync({ _id: req.query._id }, { abortEarly: false });
    await driver.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message, 'BR_Validate', 'BR_Validate'));
  }
};

const updateUser = async (req, res, next) => {
  try {
    await id.validateAsync({ _id: req.query._id }, { abortEarly: false });
    await base.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message, 'BR_Validate', 'BR_Validate'));
  }
};

const deleteDriver = async (req, res, next) => {
  try {
    await id.validateAsync({ _id: req.query._id }, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message, 'BR_Validate', 'BR_Validate'));
  }
};

const valid = async (req, res, next) => {
  try {
    await user.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message, 'BR_Validate', 'BR_Validate'));
  }
};

const changePassword = async (req, res, next) => {
  try {
    await checkPassWord.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message, 'BR_Validate', 'BR_Validate'));
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
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message, 'BR_Validate', 'BR_Validate'));
  }
};

const createEmployee = async (req, res, next) => {
  try {
    await employee.validateAsync(req.body, { abortEarly: false });
    // Dieu huong sang tang Controller
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message, 'BR_Validate', 'BR_Validate'));
  }
};

export const userValidation = {
  login,
  createNew,
  createUser,
  valid,
  validateToUpdate,
  createDriver,
  updateDriver,
  deleteDriver,
  updateUser,
  changePassword,
  createEmployee,
};
