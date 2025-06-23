import jwt from 'jsonwebtoken';
import config from '../config/jwt.js';

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  // Eliminar "Bearer " si está presente
  const tokenString = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;

  try {
    const decoded = jwt.verify(tokenString, config.secret);
    req.user = decoded; // El token decodificado estará disponible en req.user
    next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized! Token inválido o expirado." });
  }
};

export default verifyToken;
