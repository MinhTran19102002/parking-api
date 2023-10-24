import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import {userService} from '~/services/userService'

const login = async (req, res, next) => {
  try {
    console.log(req.body)

    // throw new ApiError (,'Loi khong xac dinh')
    // Dieu huong sang tang Service
    const loginUser = await userService.login(req.body)

    res.status(StatusCodes.OK).json(loginUser)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  login
}