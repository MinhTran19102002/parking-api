import express from 'express'
import {StatusCodes} from 'http-status-codes'
import {parkingController} from '~/controllers/parkingController'
import { verifyTokenMidleware } from '~/middlewares/verifytokenMidleware'
import {parkingValidation} from '~/validations/parkingValidation'

const Router = express.Router()

Router.route('/getStatusByZone')
  .get(verifyTokenMidleware.verifyTokenAndManager,parkingController.getStatusByZone) //verifyTokenMidleware.verifyToken,

Router.route('/createPaking')
  .post( parkingValidation.create,verifyTokenMidleware.verifyTokenAndManager, parkingController.createPaking)

Router.route('/getStatus')
  .get(verifyTokenMidleware.verifyTokenAndManager, parkingController.getStatus)


export const parkingRoute = Router