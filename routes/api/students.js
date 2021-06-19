const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Student = require("../../models/student");

// add regex to name
// add validation to email
// create a folder for validation

// @route  POST api/students
// @desc   Create a student
// @access Private

router.post(
  "/create-student",
  verifyToken,
  [
    check("name", "Name is Required").not().isEmpty(),
    check("phone", "phone is required").isMobilePhone(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone, enquiryStatus, enrollmentStatus } = req.body;
    try {
      let studentPhone = await Student.findOne({ phone });
      if (studentPhone) {
        res.status(400).send("Student already exists");
      }

      if (!req.body.email) {
        student = new Student({
          name,
          phone,
          enquiryStatus,
          enrollmentStatus,
        });
      } else {
        let studentEmail = await Student.findOne({ email });
        if (studentEmail) {
          res.status(400).send("Student already exists");
        } else {
          student = new Student({
            name,
            email,
            phone,
            enquiryStatus,
            enrollmentStatus,
          });
        }
      }
      student.save();
    } catch (err) {
      res.status(500).send(err.message);
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
    res.status(500).send(err.message);
  }
});

// @route  POST api/students
// @desc   update the details of a student
// @access Private

router.put("/update-student/:phone", verifyToken, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      enquiryStatus,
      enrollmentStatus,
      enquiryDate,
      enrollmentDate,
    } = req.body;
    const student = await Student.findOne({ phone: req.params.phone });

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    if (name) student.name = name;
    if (email) student.email = email;
    if (phone) student.phone = phone;
    if (enquiryStatus) student.enquiryStatus = enquiryStatus;
    if (enrollmentStatus) student.enrollmentStatus = enrollmentStatus;
    if (enquiryDate) student.enquiryDate = enquiryDate;
    if (enrollmentDate) student.enrollmentDate = enrollmentDate;

    res.json({ msg: `Student data got updated` });
  } catch (err) {
    res.status(500).send(err.message);
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
    res.status(500).send(err.message);
  }
});

module.exports = router;
