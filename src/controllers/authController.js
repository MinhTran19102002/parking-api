import { StatusCodes } from 'http-status-codes'
import {userService} from '~/services/personService'

const login = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const loginUser = await userService.login(req, res)

    res.status(StatusCodes.OK).json(loginUser)
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const refreshToken = await userService.refreshToken(req, res)

    res.status(StatusCodes.OK).json(refreshToken)
  } catch (error) {
    next(error)
  }
}

const checkToken = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const refreshToken = await userService.checkToken(req, res)
    // console('refreshToken')
    res.status(StatusCodes.OK).json(refreshToken)
  } catch (error) {
    next(error)
  }
}

export const authController = {
  login,
  refreshToken,
  checkToken,
}