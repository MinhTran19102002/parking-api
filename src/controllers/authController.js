import { StatusCodes } from 'http-status-codes'
import {userService} from '~/services/userService'

const login = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const loginUser = await userService.login(req.body)

    res.status(StatusCodes.OK).json(loginUser)
  } catch (error) {
    next(error)
  }
}

export const authController = {
  login
}