import express from 'express'
import {StatusCodes} from 'http-status-codes'
import {parkingTurnController} from '~/controllers/parkingTurnController'

const Router = express.Router()

Router.route('/createPakingTurn')
  .post(parkingTurnController.createNew)

Router.route('/outPaking')
  .post(parkingTurnController.outPaking)

Router.route('/Reports/GetVehicleInOutNumber')
  .get(parkingTurnController.getVehicleInOutNumber)
export const parkingTurnRoute = Router