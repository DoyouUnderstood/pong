import jwt from 'jsonwebtoken'
import { config } from '../plugins/jwt.js'

export default function jwtServiceFactory() {
  return {
    generateToken(payload) {
      return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn })
    },

    verifyToken(token) {
      return jwt.verify(token, config.jwtSecret)
    }
  }
}