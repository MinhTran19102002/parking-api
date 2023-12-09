import express from 'express'
import {StatusCodes} from 'http-status-codes'
import {parkingTurnController} from '~/controllers/parkingTurnController'
import { verifyTokenMidleware } from '~/middlewares/verifytokenMidleware'
import { parkingTurnValidation } from '~/validations/parkingTurnValidation'

const Router = express.Router()

Router.route('/createPakingTurn')
  .post(parkingTurnValidation.create,parkingTurnController.createNew)

Router.route('/createPakingTurnWithoutPosition')
  .post(parkingTurnValidation.createWithoutPosition,parkingTurnController.createNewWithoutPosition)

Router.route('/createPakingTurnWithoutZoneAndPosition')
  .post(parkingTurnValidation.createWithoutZoneAndPosition, parkingTurnController.createNewWithoutZone)

Router.route('/outPaking')
  .post(parkingTurnController.outPaking)

Router.route('/Reports/GetVehicleInOutNumber')
  .get( parkingTurnController.getVehicleInOutNumber)

Router.route('/Reports/GetRevenue')
  .get(verifyTokenMidleware.verifyTokenAndAdminManager, parkingTurnController.getRevenue)

Router.route('/event')
  .get(verifyTokenMidleware.verifyTokenAndAdminManager, parkingTurnController.getEvent)

Router.route('/event/export')
  .get(parkingTurnController.exportEvent)

export const parkingTurnRoute = Router