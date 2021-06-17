const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Student = require("../../models/student");

// @route  POST api/students
// @desc   Create a student
// @access Private

// create a folder for validation
router.post(
  "/create-student",
  [
    check("name", "Name is Required").not().isEmpty(),
    check("phone", "phone is required").isNumeric(),
    check("enrollmentStatus", "status of enrollment is required").isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone, enrollmentStatus } = req.body;
    try {
      // See if student exists
      let student = await Student.findOne({ phone });
      if (student) {
        res.status(400).json({ errors: [{ msg: "Student already exists" }] });
      }

      if (!req.body.email) {
        student = new Student({
          name,
          phone,
          enrollmentStatus,
        });
      } else {
        student = new Student({
          name,
          email,
          phone,
          enrollmentStatus,
        });
      }
      student.save();
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route  GET api/students
// @desc   Find a student by phone number
// @access Private

router.get("/find-student/:phone", verifyToken, async (req, res) => {
  try {
    const student = await Student.findOne({ phone: req.params.phone });

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/students
// @desc   get list of all the students
// @access Private

router.get("/list-students", verifyToken, async (req, res) => {
  try {
    const students = await Student.find((err, students) => {
      if (!students) {
        return res.status(404).json({ msg: "No data available" });
      }
    });
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/students
// @desc   get list of all the enrolled students
// @access Private

router.get("/list-enrolled-students", verifyToken, async (req, res) => {
  try {
    const query = { enrollmentStatus: true };
    const enrolledStudents = await Student.find(
      query,
      (err, enrolledStudents) => {
        if (!enrolledStudents) {
          return res.status(404).json({
            msg: "No enrolled students",
          });
        }
      }
    );
    res.json(enrolledStudents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/students
// @desc   get all the enrolled students enrollment status
// @access Private

router.get("/list-enquiry-students", verifyToken, async (req, res) => {
  try {
    const query = { enrollmentStatus: false };
    const enquiredStudents = await Student.find(
      query,
      (err, enquiredStudents) => {
        if (!enquiredStudents) {
          return res.status(404).json({
            msg: "No enolled students",
          });
        }
      }
    );
    res.json(enquiredStudents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/students
// @desc   update the details of a student
// @access Private

router.put("/update-student/:phone", verifyToken, async (req, res) => {
  try {
    const { name, email, phone, year } = req.body;
    const student = await Student.findOne({ phone: req.params.phone });

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    if (name) student.name = name;
    if (email) student.email = email;
    if (phone) student.phone = phone;
    if (year) student.year = year;

    res.json({ msg: `Student data got updated` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/students
// @desc   get a student entry
// @access Private

router.delete("/delete-student/:phone", verifyToken, async (req, res) => {
  try {
    await Student.findOneAndDelete(
      { phone: req.params.phone },
      (err, result) => {
        if (result != null) {
          res.status(200).json({ result });
        } else {
          res.status(400).send("Student could not be deleted");
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
