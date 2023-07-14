import { carsCollection } from '../server.js';

export const getAllCars = async (req, res, next) => {
  try {
    const cursor = carsCollection.find();

    const result = [];
    for await (let car of cursor) {
      result.push(car);
    }

    res.status(200).json({
      status: 'success',
      result: result.length,
      data: {
        cars: result,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createCar = async (req, res, next) => {
  try {
    const car = await carsCollection.insertOne(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        car,
      },
    });
  } catch (err) {
    next(err);
  }
};
