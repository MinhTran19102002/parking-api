import { StatusCodes } from 'http-status-codes'
import {parkingTurnService} from '~/services/parkingTurnService'

const createNew = async (req, res, next) => {
  try {
    const licenePlate = req.body.licenePlate
    const zone = req.body.zone
    const position = req.body.position
    // Dieu huong sang tang Service
    const createUser = await parkingTurnService.createPakingTurn(licenePlate, zone, position)

    res.status(StatusCodes.CREATED).json(createUser)
  } catch (error) {
    next(error)
  }
}

const outPaking = async (req, res, next) => {
  try {
    const licenePlate = req.body.licenePlate
    // Dieu huong sang tang Service
    const outPaking = await parkingTurnService.outPaking(licenePlate)

    res.status(StatusCodes.OK).json(outPaking)
  } catch (error) {
    next(error)
  }
}

const getVehicleInOutNumber = async (req, res, next) => {
  try {
    const startDate = req.query.startDate
    const endDate = req.query.endDate
    // Dieu huong sang tang Service
    const getVehicleInOutNumber = await parkingTurnService.getVehicleInOutNumber(startDate, endDate)

    res.status(StatusCodes.OK).json(getVehicleInOutNumber)
  } catch (error) {
    next(error)
  }
}

export const parkingTurnController = {
  createNew,
  outPaking,
  getVehicleInOutNumber
}