const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Course = require("../../Models/course");

// @route POST api/admin/courses
// @desc Create a course description
// @access Private

router.post(
  "/create-course",
  verifyToken,
  [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Please enter the name of course")
      .isLength({ min: 2 })
      .withMessage("Course name should be atleast 2 letter long"),
    check("fees")
      .not()
      .isEmpty()
      .withMessage("Please enter the fees of course"),
    check("authorName")
      .not()
      .isEmpty()
      .withMessage("Please enter the name of author")
      .isLength({ min: 2 })
      .withMessage("Please enter a valid name"),
    check("rating")
      .not()
      .isEmpty()
      .withMessage("Please enter the course rating")
      .isNumeric({ min: 1, max: 10 })
      .withMessage(
        "Please enter a valid rating, course rating should be between 1 and 10"
      ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(406)
        .json({ errors: errors.array({ onlyFirstError: true }) });
    }
    const { name, fees, authorName, rating } = req.body;
    try {
      let courseName = await Course.findOne({ name });
      if (courseName) {
        return res
          .status(400)
          .json({ message: "Entered course already exists" });
      }
      course = new Course({ name, fees, authorName, rating });
      course.save();
      return res.status(200).json({ message: "Course entry created" });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);

// @route GET api/admin/courses
// @desc list all the courses
// @access Private

router.get("/list-courses", verifyToken, async (req, res) => {
  try {
    const courses = await Course.find((err, courses) => {
      if (!courses) {
        return res.status(400).json({ message: "No data available" });
      }
    });
    return res.status(200).json(courses);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// @route UPDATE api/admin/courses
// @desc update the details of a course
// @access Private

router.put("/update-course/:id", verifyToken, async (req, res) => {
  try {
    const { name, fees, authorName, rating } = req.body;
    const course = await Course.findOne({ _id: req.params.id });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (name) course.name = name;
    if (fees) course.fees = fees;
    if (authorName) course.authorName = authorName;
    if (rating) course.rating = rating;

    await course.save();
    return res.status(200).json(course);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// @route DELETE api/admin/courses
// @desc delete a course
// @access Private

router.delete("/delete-course/:id", verifyToken, async (req, res) => {
  try {
    let courseID = req.params.id;
    const deletedCourse = await Course.findByIdAndDelete(courseID);
    if (!deletedCourse) {
      return res.status(400).json({ message: "Error in deleting the course" });
    }
    return res.status(200).json(deletedCourse);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// router.delete("/delete-course/:id ", verifyToken, async (req, res) => {
//   try {
//     await Student.findOneAndDelete({ id: req.params._id }, (err, result) => {
//       if (result !== null) {
//         return res.status(200).json({ result });
//       } else {
//         return res.status(400).json(err);
//       }
//     });
//   } catch (err) {
//     return res.status(500).send(err.message);
//   }
// });

module.exports = router;
