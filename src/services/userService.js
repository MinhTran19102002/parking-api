import {slugify} from '~/utils/formatter'
import {userModel} from '~/models/personModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {env} from '~/config/environment'


const login = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // const login = {
    //   user: {
    //     username: data.username,
    //     password: data.password,
    //     role: data.role
    //   }
    //   //slug: slugify(data.username)
    // }
    const findOne = await userModel.findOne(data)
    if (!findOne) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not exist')
    }
    const validatePasword = await bcrypt.compare(data.password, findOne.user.password)
    if (!validatePasword) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Password is wrong')
    }
    const accessToken = jwt.sign({
      id: findOne._id,
      name: findOne.name,
      username: findOne.user.username
    }, env.JWT_ACCESS_KEY, { expiresIn: '2h' })
    delete findOne.user.password
    // const { user: { password,  }, ...userLogin } = findOne
    return { findOne, accessToken }
  } catch (error) {
    throw error
  }
}

const createUser = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const hashed = await hashPassword(data.user.password)

    data.user.password = hashed
    const createUser = await userModel.createNew(data)
    if (createUser.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'User is not created')
    }
    return createUser
  } catch (error) {
    throw error
  }
}

const hashPassword = async (password) =>{
  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(password, salt)
  return hashed
}

// const generateToken = () => {
//   const payload = { username: user.username };
//   return jwt.sign(payload, secretKey, { expiresIn: '1h' }) // Token hết hạn sau 1 giờ

// }

export const userService = {
  login,
  createUser
}