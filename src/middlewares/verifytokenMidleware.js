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
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token không hợp lệ', 'auth', 'BR_auth');
      }
      req.user = user;
      next();
    });
  } else {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Bạn chưa được xác thực', 'auth', 'BR_auth');
  }
};

const verifyTokenAndAdminManager = (req, res, next) => {
  // next(); /// neu test tren postman thi mo doan code nay
  verifyToken(req, res, () => {
    if (req.user.role == 'Admin' || req.user.role == 'Manager') {
      next();
    } else {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Bạn không được phép thực hiện hành động này',
        'auth',
        'BR_auth',
      );
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  // next(); /// neu test tren postman thi mo doan code nay
  verifyToken(req, res, () => {
    if (req.user.role == 'Admin') {
      next();
    } else {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Bạn không được phép thực hiện hành động này',
        'auth',
        'BR_auth',
      );
    }
  });
};

const verifyTokenAndManager = (req, res, next) => {
  //next(); /// neu test tren postman thi mo doan code nay
  verifyToken(req, res, () => {
    if (req.user.role == 'Manager') {
      next();
    } else {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Bạn không được phép thực hiện hành động này',
        'auth',
        'BR_auth',
      );
    }
  });
};

export const verifyTokenMidleware = {
  createToken,
  verifyToken,
  verifyTokenAndAdminManager,
  verifyTokenAndAdmin,
  verifyTokenAndManager,
};
