import AppError from '../utils/appError.js';

const handleJWTTokenError = () =>
  new AppError('Invalid token! Please login again', 401);

const handleJWTExpires = () =>
  new AppError('Token expired! Please login again', 401);

const sendErrorDev = (err, res) => {
  if (err.isCelebrate) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorPro = (err, res) => {
  if (err.isCelebrateError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default (err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = err;

    if (err.name === 'JsonWebTokenError') error = handleJWTTokenError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpires();

    sendErrorPro(error, res);
  }
};
