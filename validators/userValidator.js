const Joi = require('joi');

const name = Joi.string().trim().min(2).max(128).required();

const email = Joi.string().trim().email().min(8).max(128).required();

const password = Joi.string()
  .min(8)
  .max(72, 'utf8')
  .regex(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u)
  .message(
    '"{#label}" must contain at least: 1 digit, 1 uppercase letter and 1 lowercase letter'
  )
  .required();

const phoneNumber = Joi.string()
  .trim()
  .length(10)
  .regex(/^[0-9]*$/)
  .message('Only numbers allowed')
  .required();

const signUpSchema = Joi.object({ name, email, password, phoneNumber });

const signInSchema = Joi.object({ email, password });

module.exports = { signUpSchema, signInSchema };
