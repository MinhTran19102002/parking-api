import jwt from 'jsonwebtoken';
import { env } from '~/config/environment';
import { StatusCodes } from 'http-status-codes';

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
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ errToken: 401, message: 'Token không hợp lệ', type: 'auth', code: 'BR_auth' });
        return;
      }
      req.user = user;
      next();
    });
  } else {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: 'Bạn chưa được xác thực', type: 'auth', code: 'BR_auth' });
  }
};

const verifyTokenAndAdminManager = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role == 'Admin' || req.user.role == 'Manager') {
      next();
    } else {
      res.status(StatusCodes.FORBIDDEN).json({
        message: 'Bạn không được phép thực hiện hành động này',
        type: 'auth',
        code: 'BR_auth',
      });
    }
  });
};

export const verifyTokenMidleware = {
  createToken,
  verifyToken,
  verifyTokenAndAdminManager,
};
