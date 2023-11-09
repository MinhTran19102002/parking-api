import { StatusCodes } from 'http-status-codes'
import {userService} from '~/services/personService'
import bcrypt from 'bcrypt'

const createNew = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const createUser = await userService.createUser(req.body)

    res.status(StatusCodes.CREATED).json(createUser)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  createNew
}