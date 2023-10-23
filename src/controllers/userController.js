import { StatusCodes } from 'http-status-codes'

const login = async (req, res, next) => {
  try {
    console.log(req.body)

    // Dieu huong sang tang Service
    res.status(StatusCodes.OK).json({ message: 'Login success post from controler' })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: error.message })
  }
}

export const userController = {
  login
}