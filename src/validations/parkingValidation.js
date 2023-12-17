import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const create = async (req, res, next) => {
  const correctCondition = Joi.object({
    zone: Joi.string().required().min(1).max(2).trim().strict(),
    description: Joi.string().max(100).trim().strict(),
    total: Joi.number().strict(),
    occupied : Joi.number().strict(),
    slots: Joi.array().items({
      position: Joi.string().min(4).max(6).trim().strict().required(),
      isBlank: Joi.boolean().default(true),
    }).min(1).unique('position').required(),
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Dieu huong sang tang Controller
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message, 'BR_Validate', 'BR_Validate'))
  }
}

export const parkingValidation = {
  create,
}