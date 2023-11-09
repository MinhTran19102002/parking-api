import express from 'express'
import {StatusCodes} from 'http-status-codes'
import {userValidation} from '~/validations/userValidation'
import {authController} from '~/controllers/authController'

const Router = express.Router()

Router.route('/login')
  .post(userValidation.login, authController.login)

Router.route('/refreshToken')
  .post(authController.refreshToken)

export const authRoute = Router