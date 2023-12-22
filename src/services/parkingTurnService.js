import { userModel } from '~/models/personModel';
import ApiError from '~/utils/ApiError';
import { parkingModel } from '~/models/parkingModel';
import { parkingTurnModel } from '~/models/parkingTurnModel';
import { vehicleModel } from '~/models/vehicleModel';
import { eventModel } from '~/models/eventModel';
import { StatusCodes } from 'http-status-codes';
import express from 'express';
import { ObjectId } from 'mongodb';
import moment from 'moment';
// import { Excel } from 'exceljs';
const ExcelJS = require('exceljs');

const createPakingTurn = async (licenePlate, zone, position) => {
  try {
    // Nếu API cần random dữ liệu của zone
    if (zone == '') {
      const zone_random = ['A', 'B', 'C'];
      zone = zone_random[Math.floor(Math.random() * zone_random.length)];
    }
    //tim vehicleId
    let vihicle = await vehicleModel.findOneByLicenePlate(licenePlate);
    if (!vihicle) {
      const createVehicle = await vehicleModel.createNew({ licenePlate: licenePlate, type: 'Car' });
      vihicle = { _id: createVehicle.insertedId };

      if (createVehicle.acknowledged == false) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Xe tạo không thành công',
          'Not Created',
          'BR_vihicle_2',
        );
      }
    }
    //tim parkingId
    const parking = await parkingModel.findOne(zone);
    // Nếu API cần random dữ liệu của position
    let slotRandom;
    if (position == '') {
      if (parking.total == parking.occupied) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Bãi đỗ ' + parking.zone + ' đầy',
          'full',
          'BR_parkingTurn_5',
        );
      }
      do {
        slotRandom = parking.slots[Math.floor(Math.random() * parking.slots.length)];
      } while (!slotRandom.isBlank);
      position = slotRandom.position;
      console.log(slotRandom);
    }

    const now = Date.now();
    const data = {
      vehicleId: vihicle._id.toString(),
      parkingId: parking._id.toString(),
      position: position,
      fee: 10000,
      start: now,
      _destroy: false,
    };

    const createPakingTurn = await parkingTurnModel.createNew(data);
    if (createPakingTurn.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Lượt đỗ tạo không thành công',
        'Not Created',
        'BR_parkingTurn_2',
      );
    }
    if (parking.total == parking.occupied + 1)
      await eventModel.createEvent({
        name: 'parking_full',
        zone: parking.zone,
        createdAt: now,
      });
    else if (parking.total - 3 <= parking.occupied + 1) {
      await eventModel.createEvent({
        name: 'almost_full',
        zone: parking.zone,
        createdAt: now,
      });
    }
    await eventModel.createEvent({
      name: 'in',
      eventId: createPakingTurn.insertedId,
      createdAt: now,
    });
    return createPakingTurn;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message, error.type, error.code);
  }
};

const outPaking = async (licenePlate) => {
  try {
    //tim vehicleId
    const vihicle = await vehicleModel.findOneByLicenePlate(licenePlate);
    if (!vihicle) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Xe không tồn tại',
        'Error',
        'BR_vihicle_5',
      );
    }
    //
    const now = Date.now();
    const filter = { vehicleId: vihicle._id, _destroy: false };
    const outPaking = await parkingTurnModel.updateOut(filter, now);
    if (outPaking.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error');
    }
    await eventModel.createEvent({ name: 'out', eventId: outPaking._id, createdAt: now });
    return outPaking;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getVehicleInOutNumber = async (req, res) => {
  let startDate;
  let endDate;

  if (req.query.startDate === undefined) {
    endDate = moment().clone().add(1, 'days').format('DD/MM/YYYY');
    startDate = moment().clone().subtract(6, 'days').format('DD/MM/YYYY');
  } else {
    startDate = moment(req.query.startDate, 'DD/MM/YYYY').format('DD/MM/YYYY');
    endDate = moment(req.query.endDate, 'DD/MM/YYYY').clone().add(1, 'days').format('DD/MM/YYYY');
  }
  console.log(endDate + '         ' + startDate);
  try {
    const getVehicleInOutNumber = await parkingTurnModel.getVehicleInOutNumber(startDate, endDate);
    if (outPaking.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Thống kê lượt xe không thành công',
        'Not Success',
        'BR_parkingTurn_4',
      );
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
    endDate = moment().clone().add(1, 'days').format('DD/MM/YYYY');
    startDate = moment().clone().subtract(6, 'days').format('DD/MM/YYYY');
  } else {
    startDate = moment(req.query.startDate, 'DD/MM/YYYY').format('DD/MM/YYYY');
    endDate = moment(req.query.endDate, 'DD/MM/YYYY').clone().add(1, 'days').format('DD/MM/YYYY');
  }
  try {
    const getRevenue = await parkingTurnModel.getRevenue(startDate, endDate);
    if (getRevenue.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Thống kê doanh số không thành công',
        'Not Success',
        'BR_parkingTurn_5',
      );
    }
    return getRevenue;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getEvent = async (req, res) => {
  // const pageIndex = req.query.pageIndex;
  // const pageSize = req.query.pageSize;
  const filter = req.query;
  try {
    const findEvent = await eventModel.findEvent(filter);
    if (findEvent.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Không tìm thấy sự kiện',
        'Not Found',
        'BR_event_1',
      );
    }
    return findEvent;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const exportEvent = async (req, res) => {
  const filter = { pageSize: 50, pageIndex: 1 };
  try {
    const findEvent = await eventModel.exportEvent(filter);
    if (findEvent.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Không tìm thấy sự kiện',
        'Not Found',
        'BR_event_1',
      );
    }
    const data = findEvent.data;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    // Thêm dòng tiêu đề
    worksheet.columns = [
      { header: 'STT', key: 'stt', width: 15, style: { font: { bold: true } } },
      { header: 'Sự kiện', key: 'name', width: 15, style: { font: { bold: true } } },
      { header: 'Họ và tên', key: 'person.name', width: 15, style: { font: { bold: true } } },
      { header: 'Email', key: 'person.email', width: 30, style: { font: { bold: true } } },
      { header: 'SDT', key: 'person.phone', width: 15, style: { font: { bold: true } } },
      { header: 'Biển số', key: 'vehicle.licenePlate', width: 15, style: { font: { bold: true } } },
      {
        header: 'Position',
        key: 'parkingTurn.position',
        width: 15,
        style: { font: { bold: true } },
      },
      { header: 'Fee', key: 'parkingTurn.fee', width: 15, style: { font: { bold: true } } },
      { header: 'Thời gian', key: 'createAt', width: 15, style: { font: { bold: true } } },
    ];
    let stt = 1;
    // Thêm dữ liệu từ JSON vào Worksheet
    await data.forEach((item) => {
      let namePerson = 'Không xác định',
        email = 'Không xác định',
        phone = 'Không xác định';
      if (item.person) {
        namePerson = item.person.name;
        email = item.person.email;
        phone = item.person.phone;
      }
      worksheet.addRow([
        stt++,
        item.name,
        namePerson,
        email,
        phone,
        item.vehicle.licenePlate,
        item.parkingTurn.position,
        item.parkingTurn.fee + ' VND',
        moment(item.createdAt).format('DD/MM/YYYY HH:mm:ss'),
        // Thêm các trường khác theo yêu cầu của bạn
      ]);
    });
    // Tạo một tệp Excel và gửi nó dưới dạng phản hồi HTTP
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition',
      'attachment; filename=output.xlsx',
    );
    await workbook.xlsx.write(res);
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
  exportEvent,
};
