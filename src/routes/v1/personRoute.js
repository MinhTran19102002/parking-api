import express from 'express'
import {StatusCodes} from 'http-status-codes'
import {userValidation} from '~/validations/userValidation'
import {userController} from '~/controllers/personController'

const Router = express.Router()

Router.route('/')
  .post(userValidation.createNew, userController.createNew)

Router.route('/driver')
  .post( userController.createDriver)
  .get(userController.findDriver)

Router.route('/getAll')
  .get(userController.findUsers)

export const userRoute = Router