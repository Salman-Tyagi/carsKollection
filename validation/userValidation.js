import { celebrate, Joi, Segments } from 'celebrate';

const userValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .trim()
      .email({ minDomainSegments: 2 })
      .required()
      .label('Email'),
    location: Joi.string().alphanum().trim().required().label('Location'),
    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required()
      .label('Password'),
    role: Joi.string().trim().default('user').forbidden(),
    userInfo: Joi.string().trim(),
    vehicleInfo: Joi.string().trim().alphanum(),
  }),
});

export default userValidation;
