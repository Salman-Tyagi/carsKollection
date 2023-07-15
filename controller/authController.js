import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongodb from 'mongodb';
import { userCollection } from '../server.js';
import AppError from '../utils/appError.js';
// import isTokenExpired from '../utils/isTokenExpired.js';

export const signup = async (req, res, next) => {
  try {
    const user = await userCollection.insertOne(req.body);

    res.status(201).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Please enter email or password', 400));
    }

    // Find user based on the input
    const user = await userCollection.findOne({ email });

    // Check password is correct
    const comparePassword = await bcrypt.compare(password, user.password);

    if (!user || !comparePassword)
      return next(new AppError('Incorrect email or password', 400));

    // Generate token and send the token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const cookieOptions = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      // secure: true,
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    // Set the token in cookie
    res.cookie('jwt', token, cookieOptions);

    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const protect = async (req, res, next) => {
  try {
    // Check if the token available
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please login to get access', 401)
      );
    }

    // Verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from the validated token
    const user = await userCollection.findOne({
      _id: new mongodb.ObjectId(decode._id),
    });

    if (user.passwordChangedAt && user.passwordChangedAt > decode.iat) {
      return next(
        new AppError('User recently changed password! Please login again', 401)
      );
    }

    // Everything ok, grant access to user
    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

export const restrictedTo = (...roles) => {
  try {
    return async (req, res, next) => {
      if (!roles.includes(req.user.role))
        return next(new AppError('You are not allowed get access', 403));

      next();
    };
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    // Get user from the collection and update the password
    const user = await userCollection.updateOne(
      { email: req.user.email },
      {
        $set: {
          password: req.body.password,
          passwordChangedAt: parseInt(Date.now() / 1000),
        },
      }
    );

    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    jwt.sign({ my: 'school' }, 'none', {
      expiresIn: 3 * 1000,
    });

    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 2 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      status: 'success',
      message: 'You are logged out',
    });
  } catch (err) {
    next(err);
  }
};
