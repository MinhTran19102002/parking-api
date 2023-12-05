import { userModel } from '~/models/personModel';
import ApiError from '~/utils/ApiError';
import { parkingModel } from '~/models/parkingModel';
import { parkingTurnModel } from '~/models/parkingTurnModel';
import { vehicleModel } from '~/models/vehicleModel';
import { eventModel } from '~/models/eventModel';
import { StatusCodes } from 'http-status-codes';
import express from 'express';
import { ObjectId } from 'mongodb';

const createPakingTurn = async (licenePlate, zone, position) => {
  try {
    //tim vehicleId
    let vihicle = await vehicleModel.findOneByLicenePlate(licenePlate);
    if (!vihicle) {
      const createVehicle = await vehicleModel.createNew({ licenePlate: licenePlate, type: 'Car' });
      vihicle = { _id: createVehicle.insertedId };

      if (createVehicle.acknowledged == false) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error');
      }
    }
    //tim parkingId
    const parking = await parkingModel.findOne(zone);
    //
    const now = Date.now()
    const data = {
      vehicleId: vihicle._id.toString(),
      parkingId: parking._id.toString(),
      position: position,
      fee: 10000,
      start: now,
      _destroy: false,
    };
    
    const createPaking = await parkingTurnModel.createNew(data);
    if (createPaking.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error');
    }
    await eventModel.createEvent({ name: 'in', eventId: createPaking.insertedId, createdAt: now })
    return createPaking;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const outPaking = async (licenePlate) => {
  try {
    //tim vehicleId
    const vihicle = await vehicleModel.findOneByLicenePlate(licenePlate);
    if (!vihicle) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'The car not exist');
    }
    //
    const now = Date.now()
    const filter = { vehicleId: vihicle._id, _destroy: false };
    const outPaking = await parkingTurnModel.updateOut(filter, now);
    if (outPaking.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error');
    }
    await eventModel.createEvent({ name: 'Out', eventId: outPaking._id, createdAt: now })
    return outPaking;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const formatDay = (day) => {
  let today = new Date();
  if (day == '7') {
    today.setDate(today.getDate() - 7);
  }
  const dd = String(today.getDate()).padStart(2, '0'); // Lấy ngày và định dạng thành "dd"
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // Lấy tháng (chú ý: tháng bắt đầu từ 0) và định dạng thành "mm"
  const yyyy = today.getFullYear(); // Lấy năm

  return `${dd}/${mm}/${yyyy}`; // Tạo định dạng "dd/mm/yyyy"
};

const getVehicleInOutNumber = async (req, res) => {
  let startDate;
  let endDate;

  if (req.query.startDate === undefined) {
    startDate = formatDay('7');
    endDate = formatDay('today');
  } else {
    startDate = req.query.startDate;
    endDate = req.query.endDate;
  }
  try {
    const getVehicleInOutNumber = await parkingTurnModel.getVehicleInOutNumber(startDate, endDate);
    if (outPaking.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error');
    }
    return getVehicleInOutNumber;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getRevenue = async (req, res) => {
  let startDate;
  let endDate;

  if (req.query.startDate === undefined) {
    startDate = formatDay('7');
    endDate = formatDay('today');
  } else {
    startDate = req.query.startDate;
    endDate = req.query.endDate;
  }
  try {
    const getRevenue = await parkingTurnModel.getRevenue(startDate, endDate);
    if (getRevenue.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error');
    }
    return getRevenue;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getEvent = async (req, res) => {
  // const pageIndex = req.query.pageIndex;
  // const pageSize = req.query.pageSize;
  const filter = req.query
  try {
    const findEvent = await eventModel.findEvent(filter);
    if (findEvent.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Driver not exist');
    }
    return findEvent;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const parkingTurnService = {
  createPakingTurn,
  outPaking,
  getVehicleInOutNumber,
  getRevenue,
  getEvent,
};
