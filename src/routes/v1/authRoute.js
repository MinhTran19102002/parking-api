import express from 'express'
import {StatusCodes} from 'http-status-codes'
import {userValidation} from '~/validations/personValidation'
import {authController} from '~/controllers/authController'

const Router = express.Router()

Router.route('/login')
  .post(userValidation.login, authController.login)

Router.route('/refreshToken')
  .post(authController.refreshToken)

Router.route('/checkToken')
.post(authController.checkToken)

// Router.route('/logout').post()

export const authRoute = Router