import { celebrate, Joi, Segments } from 'celebrate';

const dealerValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .trim()
      .email({ minDomainSegments: 2 })
      .required()
      .label('Email'),
    name: Joi.string().trim().max(40).required().label('Name'),
    location: Joi.string().alphanum().trim().required().label('Location'),
    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required()
      .label('Password'),
    dealerShipInfo: Joi.string().trim(),
    cars: Joi.string().trim().alphanum(),
    deals: Joi.string().trim().alphanum(),
    soldVehicles: Joi.string().trim().alphanum(),
  }),
});

export default dealerValidation;
