import { StatusCodes } from 'http-status-codes';
import { parkingService } from '~/services/parkingService';
import ApiError from '~/utils/ApiError';

const getStatusByZone = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const getStatusByZone = await parkingService.getStatusByZone(req.query.zone);
    res.status(StatusCodes.OK).json(getStatusByZone);
  } catch (error) {
    next(error);
  }
};

const getStatus = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const getStatus = await parkingService.getStatus(req.query.zone);
    res.status(StatusCodes.OK).json(getStatus);
  } catch (error) {
    next(error);
  }
};

const createPaking = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const createPaking = await parkingService.createPaking(req.body);

    res.status(StatusCodes.CREATED).json(createPaking);
  } catch (error) {
    next(error);
  }
};

export const parkingController = {
  getStatusByZone,
  createPaking,
  getStatus,
};
