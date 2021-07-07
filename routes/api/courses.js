const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth");
const {
  createCourse,
  listCourses,
  updateCourse,
  deleteCourse,
} = require("../../controllers/courseController");

// @route POST api/admin/courses
// @desc Create a course description
// @access Private

router.post("/create-course", verifyToken, createCourse);

// @route GET api/admin/courses
// @desc list all the courses
// @access Private

router.get("/list-courses", verifyToken, listCourses);

// @route UPDATE api/admin/courses
// @desc update the details of a course
// @access Private

router.put("/update-course/:id", verifyToken, updateCourse);

// @route DELETE api/admin/courses
// @desc delete a course
// @access Private

router.delete("/delete-course/:id", verifyToken, deleteCourse);

module.exports = router;
