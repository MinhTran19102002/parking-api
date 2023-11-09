import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const login = async (req, res, next) => {
  const correctCondition = Joi.object({
    username: Joi.string().required().min(6).max(50).trim().strict(),
    password: Joi.string().required().min(8).max(20).trim().strict(),
    role: Joi.string().required().min(3).max(20).trim().strict()
  })
  try {
    await correctCondition.validateAsync(req.body, {abortEarly: false})
    // Dieu huong sang tang Controller
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().min(6).max(50).trim().strict(),
    adress: Joi.string().required().min(6).max(20).trim().strict(),
    phone: Joi.string().required().min(10).max(11).trim().strict(),
    email: Joi.string().required().min(6).max(30).trim().strict(),
    user: Joi.object({
      username: Joi.string().required().min(6).max(20).trim().strict(),
      password: Joi.string().required().min(8).max(20).trim().strict(),
      role: Joi.string().required().min(3).max(20).trim().strict()
    }).optional()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Dieu huong sang tang Controller
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const userValidation = {
  login,
  createNew
}