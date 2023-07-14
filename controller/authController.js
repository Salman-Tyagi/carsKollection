import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userCollection } from '../server.js';
import AppError from '../utils/appError.js';

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

    // Check email and password are correct
    const pass = await bcrypt.compare(password, user.password);

    if (!user || !pass)
      return next(new AppError('Incorrect email or password', 400));

    // Generate token and send the token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {};
