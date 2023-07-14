import { dealerCollection } from '../server.js';

export const getAllDealers = async (req, res, next) => {
  try {
    const cursor = dealerCollection.find();

    const result = [];
    for await (let dealer of cursor) {
      result.push(dealer);
    }

    res.status(200).json({
      status: 'success',
      result: result.length,
      data: {
        dealers: result,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createDealer = async (req, res, next) => {
  try {
    const dealer = await dealerCollection.insertOne(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        dealer,
      },
    });
  } catch (err) {
    next(err);
  }
};
