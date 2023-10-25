import jwt from 'jsonwebtoken'
import {JWT_ACCESS_KEY} from '~/config/environment'

const createToken = (User, Secret, Tokenlife) => {
  const token = jwt.sign(User, Secret, {
    algorithm : 'HS256',
    expiresIn : Tokenlife
  })
  return token
}

const verifyToken = (req, res, next) => {
  const token = req.header.token
  if (token) {
    const accessToken = token.split(' ')[1]
    jwt.verify(accessToken, JWT_ACCESS_KEY)
  }
}


export const verifyTokenMidleware = {
  createToken,
  verifyToken
}