import { celebrate, Joi, Segments } from 'celebrate';

const carValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    type: Joi.string().trim().required().label('Type'),
    name: Joi.string().trim().required().label('Name'),
    model: Joi.string().required().label('Model'),
    carInfo: Joi.string().trim(),
  }),
});

export default carValidation;
