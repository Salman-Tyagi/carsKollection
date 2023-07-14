import bcrypt from 'bcryptjs';

export default async (req, res, next) => {
  req.body.password = await bcrypt.hash(req.body.password, 12);

  next();
};
