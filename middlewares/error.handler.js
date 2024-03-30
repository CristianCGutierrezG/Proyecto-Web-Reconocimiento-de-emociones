import { ValidationError } from "sequelize";

function logErrors (err, req, res, next) {
  console.error(err);
  next(err);
}

function errorHandler(err, req, res, next) {
  
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
}

function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  } else {
    next(err);
  }
}

function ormErrorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    res.status(409).json({
      statusCode: 409,
      message: err.name,
      error: err.errors
    });
  }  
  next(err);
}

function errorHandlerExistencia(err, req, res, next) {
  if(err.parent.code === '23503') {
      return res.status(400).json({
          statusCode: 400,
          message: err.parent.detail,
          err: err.name,
      });
  }
  next(err);
}


export { logErrors, ormErrorHandler, errorHandler, boomErrorHandler, errorHandlerExistencia };
