import express from 'express'
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const login = async (req, res, next) => {
  const correctCondition = Joi.object({
    username: Joi.string().required().min(6).max(50).trim().strict(),
    password: Joi.string().required().min(6).max(50).trim().strict()
  })
  try {
    await correctCondition.validateAsync(req.body, {abortEarly: false})
    // Dieu huong sang tang Controller
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const userValidation = {
  login
}