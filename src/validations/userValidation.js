import express from 'express'
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

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
    console.log(error)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      error: new Error(error).message })
  }
}

export const userValidation = {
  login
}