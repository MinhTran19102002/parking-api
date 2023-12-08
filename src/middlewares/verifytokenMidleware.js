import jwt from 'jsonwebtoken';
import { env } from '~/config/environment';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';

const createToken = (User, Secret, Tokenlife) => {
  const token = jwt.sign(User, Secret, {
    algorithm: 'HS256',
    expiresIn: Tokenlife,
  });
  return token;
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const accessToken = token.split(' ')[1];
    jwt.verify(accessToken, env.JWT_ACCESS_KEY, (err, user) => {
      if (err) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, {message: 'Token không hợp lệ'}, {type: 'auth'}, {code: 'BR_auth' });
      }
      req.user = user;
      next();
    });
  } else {
    throw new ApiError(StatusCodes.UNAUTHORIZED, {message: 'Bạn chưa được xác thực'}, {type: 'auth'}, {code: 'BR_auth' });
  }
};

const verifyTokenAndAdminManager = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role == 'Admin' || req.user.role == 'Manager') {
      next();
    } else {
      throw new ApiError(StatusCodes.UNAUTHORIZED, {message: 'Bạn không được phép thực hiện hành động này'}, {type: 'auth'}, {code: 'BR_auth' });
    }
  });
};

export const verifyTokenMidleware = {
  createToken,
  verifyToken,
  verifyTokenAndAdminManager,
};
