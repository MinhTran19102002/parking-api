import express from 'express'
import {StatusCodes} from 'http-status-codes'
import {userValidation} from '~/validations/userValidation'
import {authController} from '~/controllers/authController'

const Router = express.Router()

Router.route('/')
  .post(userValidation.login, authController.login)

export const authRoute = Router