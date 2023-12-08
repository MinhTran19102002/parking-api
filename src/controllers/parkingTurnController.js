import { StatusCodes } from 'http-status-codes';
import { parkingTurnService } from '~/services/parkingTurnService';
import {server} from '~/server'


const createNew = async (req, res, next) => {
  try {
    let licenePlate = req.body.licenePlate;
    let zone = req.body.zone;
    let position = req.body.position;
    // Dieu huong sang tang Service
    const createUser = await parkingTurnService.createPakingTurn(licenePlate, zone, position);
    server.io.emit('notification-parking',{ message:  'Car enters the parking lot'})
    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    next(error);
  }
};

const createNewWithoutPosition = async (req, res, next) => {
  try {
    let licenePlate = req.body.licenePlate;
    let zone = req.body.zone;
    let position = '';
    // Dieu huong sang tang Service
    const createUser = await parkingTurnService.createPakingTurn(licenePlate, zone, position);
    server.io.emit('notification-parking', { message:  'Car enters the parking lot'})
    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    next(error);
  }
};

const createNewWithoutZone = async (req, res, next) => {
  try {
    let licenePlate = req.body.licenePlate;
    let zone = '';
    let position = '';
    // Dieu huong sang tang Service
    const createUser = await parkingTurnService.createPakingTurn(licenePlate, zone, position);
    server.io.emit('notification-parking',{ message:  'Car enters the parking lot'})
    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    next(error);
  }
}

const outPaking = async (req, res, next) => {
  try {
    const licenePlate = req.body.licenePlate;
    // Dieu huong sang tang Service
    const outPaking = await parkingTurnService.outPaking(licenePlate);
    server.io.emit('notification-parking',{ message:  'Car goes to the parking lot'})
    res.status(StatusCodes.OK).json(outPaking);
  } catch (error) {
    next(error);
  }
};

const getVehicleInOutNumber = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const getVehicleInOutNumber = await parkingTurnService.getVehicleInOutNumber(req, res);

    res.status(StatusCodes.OK).json(getVehicleInOutNumber);
  } catch (error) {
    next(error);
  }
};

const getRevenue = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const getRevenue = await parkingTurnService.getRevenue(req, res);

    res.status(StatusCodes.OK).json(getRevenue);
  } catch (error) {
    next(error);
  }
};

const getEvent = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const getRevenue = await parkingTurnService.getEvent(req, res);

    res.status(StatusCodes.OK).json(getRevenue);
  } catch (error) {
    next(error);
  }
};

const exportEvent = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    await parkingTurnService.exportEvent(req, res);
    // res.status(StatusCodes.OK).json('Thanh cong');
  } catch (error) {
    next(error);
  }
};

export const parkingTurnController = {
  createNew,
  createNewWithoutPosition,
  createNewWithoutZone,
  outPaking,
  getVehicleInOutNumber,
  getRevenue,
  getEvent,
  exportEvent,
};
