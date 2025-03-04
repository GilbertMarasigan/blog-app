const jwt = require('jsonwebtoken')
const logger = require('./logger')
const User = require('../models/user')

const userExtractor = async (req, res, next) => {

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract token
      const decoded = jwt.verify(token, process.env.SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.log('User not found in database');
      } else {
        console.log(`User authenticated: ${req.user.username}`);
      }

    } catch (error) {
      console.log('Invalid token:', error.message);
      req.user = null; // Set to null instead of blocking request
    }
  }

  next();
}

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()

}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userExtractor
}