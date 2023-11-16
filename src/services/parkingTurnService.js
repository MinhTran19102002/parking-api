import {userModel} from '~/models/personModel'
import ApiError from '~/utils/ApiError'
import {parkingModel} from '~/models/parkingModel'
import {parkingTurnModel} from '~/models/parkingTurnModel'
import {vehicleModel} from '~/models/vehicleModel'
import { StatusCodes } from 'http-status-codes'
import express from 'express'
import { ObjectId} from 'mongodb'

const createPakingTurn = async (licenePlate, zone, position) => {
  // const data1 = {
  //   driverId : new ObjectId('6538ebedd56683ced0852cee'),
  //   licenePlate : '12A-21731',
  //   type : 'Car'
  // }
  // vehicleModel.createNew(data1)
  // eslint-disable-next-line no-useless-catch
  try {
    //tim vehicleId
    const vihicle = await vehicleModel.findOneByLicenePlate(licenePlate)
    //tim parkingId
    const parking = await parkingModel.findOne(zone)
    //
    const data = {
      vehicleId : vihicle._id.toString(),
      parkingId : parking._id.toString(),
      position : position,
      fee : 5000,
      _destroy: false
    }
    const createPaking = await parkingTurnModel.createNew(data)
    if (createPaking.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error')
    }
    return createPaking
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const outPaking = async (licenePlate) => {
  try {
    //tim vehicleId
    const vihicle = await vehicleModel.findOneByLicenePlate(licenePlate)
    //
    const filter = { vehicleId : vihicle._id, _destroy : false }
    const outPaking = await parkingTurnModel.updateOut(filter)
    if (outPaking.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error')
    }
    return outPaking
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const formatDay = (day) =>{
  let today = new Date()
  if (day == '7') {
    today.setDate(today.getDate() - 7)
  }
  const dd = String(today.getDate()).padStart(2, '0') // Lấy ngày và định dạng thành "dd"
  const mm = String(today.getMonth() + 1).padStart(2, '0') // Lấy tháng (chú ý: tháng bắt đầu từ 0) và định dạng thành "mm"
  const yyyy = today.getFullYear() // Lấy năm

  return `${dd}/${mm}/${yyyy}` // Tạo định dạng "dd/mm/yyyy"
}

const getVehicleInOutNumber = async (req, res) => {
  const valueFromQuery = req.query.value
  let startDate
  let endDate

  if ( valueFromQuery == undefined || valueFromQuery !== null ) {
    startDate = formatDay('7')
    endDate = formatDay('today')
  }
  else {
    startDate = req.query.startDate
    endDate = req.query.endDate
  }
  try {
    const getVehicleInOutNumber = await parkingTurnModel.getVehicleInOutNumber(startDate, endDate)
    if (outPaking.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error')
    }
    return getVehicleInOutNumber
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

export const parkingTurnService = {
  createPakingTurn,
  outPaking,
  getVehicleInOutNumber
}
