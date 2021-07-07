const Joi = require("joi");

const name = Joi.string().trim().min(2).max(128).required();

const email = Joi.string().trim().email().min(8).max(128);

// Joi.string() => Joi.number().integer()
const phoneNumber = Joi.string()
  .trim()
  .length(10)
  .regex(/^[0-9]*$/)
  .message("Only numbers allowed")
  .required();

const enquiryStatus = Joi.bool();

const enquiryDate = Joi.date();

const isEnquiryActive = Joi.bool(); 

const enrollmentStatus = Joi.bool();

const isEnrollmentActive = Joi.bool();

const enrollmentDate = Joi.date();

const year = Joi.string().required();

const course = Joi.string().required();

const college = Joi.string().required();

const offeredFees = Joi.number();

const actualFees = Joi.number();

const common = { name, email, phoneNumber, year, course, college };

const createStudentSchema = Joi.object({
  ...common,
  enquiryStatus,
  isEnquiryActive,
  enrollmentStatus,
  isEnrollmentActive,
  enquiryDate,
  enrollmentDate,
  offeredFees,
  actualFees,
});

const createEnquirySchema = Joi.object({
  ...common,
  enquiryStatus,
  isEnquiryActive,
  enquiryDate,
  offeredFees: offeredFees.required(),
});

const createEnrollmentSchema = Joi.object({
  ...common,
  enrollmentStatus,
  isEnrollmentActive,
  enrollmentDate,
  offeredFees: offeredFees.required(),
  actualFees: actualFees.required(),
});

const updateStudentSchema = Joi.object({
  ...common,
  enquiryStatus,
  isEnquiryActive,
  enquiryDate,
  enrollmentStatus,
  isEnrollmentActive,
  enrollmentDate,
});

module.exports = {
  createStudentSchema,
  createEnquirySchema,
  createEnrollmentSchema,
  updateStudentSchema,
};
