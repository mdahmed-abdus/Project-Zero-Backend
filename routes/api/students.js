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

// @route  POST api/students
// @desc   Create a student enquiry
// @access Private

router.post(
  "/create-enquiry",
  verifyToken,
  [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name is required")
      .isAlpha()
      .withMessage("Name should contain only letters")
      .isLength({ min: 2 })
      .withMessage("Name should be atleast 2 letter long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone } = req.body;

    try {
      let student = await Student.findOne({ phone });
      if (student) {
        res.status(400).json({ errors: [{ msg: "Student already exists" }] });
      }

      if (!req.body.email) {
        student = new Student({
          name,
          phone,
          enquiryStatus: true,
          enquirymentDate: new Date(),
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
            enquiryStatus: true,
            enquirymentDate: new Date(),
          });
        }
      }
      student.save();
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

// @route  POST api/students
// @desc   Create enrollment for a student
// @access Private

router.post(
  "/create-enrollment",
  verifyToken,
  [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name is required")
      .isAlpha()
      .withMessage("Name should contain only letters")
      .isLength({ min: 2 })
      .withMessage("Name should be atleast 2 letter long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone } = req.body;

    try {
      let student = await Student.findOne({ phone });
      if (student) {
        res.status(400).json({ errors: [{ msg: "Student already exists" }] });
      }

      if (!req.body.email) {
        student = new Student({
          name,
          phone,
          enrollmentStatus: true,
          enrollmentDate: new Date(),
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
            enrollmentStatus: true,
            enrollmentDate: new Date(),
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

// @route  POST api/students
// @desc   get number of all the students who have enquired
// @access Private

router.get("/number-of-enquiries", verifyToken, async (req, res) => {
  try {
    const numberOfEnquiries = await Student.count(
      { enquiryStatus: true },
      (err, numOfEnquiries) => {
        if (err || numOfEnquiries === 0) {
          return res.status(404).json({
            message: "No enquiries",
          });
        }
      }
    );
    res.status(200).send(`Number of enquiries: ${numberOfEnquiries}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// @route  POST api/students
// @desc   get list of all the enrolled students
// @access Private

router.get("/list-all-enrolled-students", verifyToken, async (req, res) => {
  try {
    const enrollmentFilter = { enrollmentStatus: true };
    const enrolledStudents = await Student.find(
      enrollmentFilter,
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
    res.status(500).send(err.message);
  }
});

module.exports = router;
