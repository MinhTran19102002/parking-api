import express from 'express'
import {StatusCodes} from 'http-status-codes'
import {userValidation} from '~/validations/userValidation'
import {userController} from '~/controllers/userController'

const Router = express.Router()

Router.route('/login')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({message: 'api'})
  })
  .post(userValidation.login, userController.login)

export const userRoute = Router