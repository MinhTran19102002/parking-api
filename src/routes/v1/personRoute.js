import express from 'express'
import {StatusCodes} from 'http-status-codes'
import {userValidation} from '~/validations/userValidation'
import {userController} from '~/controllers/personController'

const Router = express.Router()

Router.route('/')
  .post(userValidation.createNew, userController.createNew)

export const userRoute = Router