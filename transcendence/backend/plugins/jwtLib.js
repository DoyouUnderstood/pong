import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';

export const jwtLib = {
  sign(payload) {
    return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
  },

  verify(token) {
    return jwt.verify(token, jwtSecret);
  }
};
