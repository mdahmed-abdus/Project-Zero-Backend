const Joi = require("joi");

const name = Joi.string().trim().min(1).max(128).required();

const authorName = Joi.string().trim().min(2).max(128).required();

const fees = Joi.number().required();

const numberOfLectures = Joi.number().required();

const duration = Joi.number().required();

const rating = Joi.number().min(0).max(10).required();

const photo = Joi.binary();

const updateCourseSchema = Joi.object({
  name,
  authorName,
  fees,
  numberOfLectures,
  duration,
  rating,
});

module.exports = { updateCourseSchema };
