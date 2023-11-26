import {userModel} from '~/models/personModel'
import ApiError from '~/utils/ApiError'
import {parkingModel} from '~/models/parkingModel'
import { StatusCodes } from 'http-status-codes'
import express from 'express'

const getStatusByZone = async (zone) => {
  const findOnde = await parkingModel.findOne(zone)
  if (!findOnde) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Zone not found')
  }
  return { zone: findOnde.zone, total: findOnde.total, occupied: findOnde.occupied, unoccupied: findOnde.total-findOnde.occupied }
}

const getStatus = async (zone) => {
  const getStatus = await parkingModel.getStatus(zone)
  if (!getStatus) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Zone not found')
  }
  return getStatus
}


const createPaking = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const createPaking = await parkingModel.createNew(data)
    if (createPaking.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Parking is not created')
    }
    return createPaking
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

export const parkingService = {
  getStatusByZone,
  createPaking,
  getStatus
}