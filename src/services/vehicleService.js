import { userModel } from '~/models/personModel';
import ApiError from '~/utils/ApiError';
import { parkingModel } from '~/models/parkingModel';
import { parkingTurnModel } from '~/models/parkingTurnModel';
import { vehicleModel } from '~/models/vehicleModel';
import { StatusCodes } from 'http-status-codes';
import express from 'express';
import { ObjectId } from 'mongodb';

const createVehicle = async (licenePlate, type) => {
  const data = {
    licenePlate : licenePlate,
    type : type,
  }
  // eslint-disable-next-line no-useless-catch
  try {
    const createNew = await vehicleModel.createNew(data)
    if (createNew.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe tạo không thành công', 'Not Deleted', 'BR_vihicle_4');
    }
    return createNew;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const vehicleService = {
  createVehicle,
};