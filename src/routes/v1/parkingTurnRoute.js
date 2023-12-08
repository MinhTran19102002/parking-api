import express from 'express'
import {StatusCodes} from 'http-status-codes'
import {parkingTurnController} from '~/controllers/parkingTurnController'
import { verifyTokenMidleware } from '~/middlewares/verifytokenMidleware'

const Router = express.Router()

Router.route('/createPakingTurn')
  .post(parkingTurnController.createNew)

Router.route('/createPakingTurnWithoutPosition')
  .post(parkingTurnController.createNewWithoutPosition)

Router.route('/createPakingTurnWithoutZoneAndPosition')
  .post(parkingTurnController.createNewWithoutZone)

Router.route('/outPaking')
  .post(parkingTurnController.outPaking)

Router.route('/Reports/GetVehicleInOutNumber')
  .get(verifyTokenMidleware.verifyTokenAndAdminManager, parkingTurnController.getVehicleInOutNumber)

Router.route('/Reports/GetRevenue')
  .get(verifyTokenMidleware.verifyTokenAndAdminManager, parkingTurnController.getRevenue)

Router.route('/event')
  .get(verifyTokenMidleware.verifyTokenAndAdminManager, parkingTurnController.getEvent)

Router.route('/event/export')
  .get(verifyTokenMidleware.verifyTokenAndAdminManager, parkingTurnController.exportEvent)

export const parkingTurnRoute = Router