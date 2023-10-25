import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
import { StatusCodes } from 'http-status-codes'

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
    jwt.verify(accessToken, env.JWT_ACCESS_KEY, (err, user) =>{
      if (err) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token is not valid' })
      }
      req.user = user
      next()
    })
  }
  else {
    res.status(StatusCodes.FORBIDDEN).json({message: 'You are not authenticated'})
  }
}


export const verifyTokenMidleware = {
  createToken,
  verifyToken
}