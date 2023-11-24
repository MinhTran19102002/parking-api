import express from 'express'
import {StatusCodes} from 'http-status-codes'
import {parkingController} from '~/controllers/parkingController'
import {parkingValidation} from '~/validations/parkingValidation'

const Router = express.Router()

Router.route('/getStatusByZone')
  .get(parkingController.getStatusByZone)

Router.route('/createPaking')
  .post(parkingValidation.create, parkingController.createPaking)

Router.route('/getStatus')
  .get(parkingController.getStatus)


export const parkingRoute = Router