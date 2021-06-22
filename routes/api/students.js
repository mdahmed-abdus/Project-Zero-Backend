const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Student = require("../../models/student");

// add regex to name and password
// add validation to email
// create a folder for validation

// @route  POST api/students
// @desc   Create a student
// @access Private

router.post(
  "/create-student",
  verifyToken,
  [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name is Required")
      .isLength({ min: 2 })
      .withMessage("Name should be atleast 2 letter long"),
    check("phoneNumber")
      .not()
      .isEmpty()
      .withMessage("Please enter student's phone number")
      .isNumeric({ min: 10, max: 10 })
      .withMessage("Please enter a valid phone number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(406)
        .json({ errors: errors.array({ onlyFirstError: true }) });
    }
    const { name, email, phoneNumber, enquiryStatus, enrollmentStatus } =
      req.body;
    try {
      let studentPhone = await Student.findOne({ phoneNumber });
      if (studentPhone) {
        return res.status(400).send("Student already exists");
      }

      if (!req.body.email) {
        if (enquiryStatus) {
          student = new Student({
            name,
            phoneNumber,
            enquiryStatus,
            enquiryDate: new Date(),
          });
        }
        if (enrollmentStatus) {
          student = new Student({
            name,
            phoneNumber,
            enrollmentStatus,
            enrollmentDate: new Date(),
          });
        }

        if (enquiryStatus && enrollmentStatus) {
          student = new Student({
            name,
            phoneNumber,
            enquiryStatus,
            enrollmentStatus,
            enquiryDate: new Date(),
            enrollmentDate: new Date(),
          });
        } else {
          student = new Student({ name, phoneNumber });
        }
      } else {
        let studentEmail = await Student.findOne({ email });
        if (studentEmail) {
          return res.status(400).send("Student already exists");
        }
        if (enquiryStatus) {
          student = new Student({
            name,
            email,
            phoneNumber,
            enquiryStatus,
            enquiryDate: new Date(),
          });
        }
        if (enrollmentStatus) {
          student = new Student({
            name,
            email,
            phoneNumber,
            enrollmentStatus,
            enrollmentDate: new Date(),
          });
        }

        if (enquiryStatus && enrollmentStatus) {
          student = new Student({
            name,
            email,
            phoneNumber,
            enquiryStatus,
            enrollmentStatus,
            enquiryDate: new Date(),
            enrollmentDate: new Date(),
          });
        } else {
          student = new Student({ name, email, phoneNumber });
        }
      }
      student.save();
      return res.status(200).send("Student registered successfully");
    } catch (err) {
      return res.status(500).send(err.message);
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
      .isLength({ min: 2 })
      .withMessage("Name should be atleast 2 letter long"),
    check("phoneNumber")
      .not()
      .isEmpty()
      .withMessage("Please enter student's phone number")
      .isNumeric({ min: 10, max: 10 })
      .withMessage("Please enter a valid phone number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array({ onlyFirstError: true }) });
    }
    const { name, email, phoneNumber } = req.body;

    try {
      let student = await Student.findOne({ phoneNumber });
      if (student) {
        res.status(400).json({ errors: [{ msg: "Student already exists" }] });
      }

      if (!req.body.email) {
        student = new Student({
          name,
          phoneNumber,
          enquiryStatus: true,
          enquiryDate: new Date(),
        });
      } else {
        let studentEmail = await Student.findOne({ email });
        if (studentEmail) {
          res.status(400).send("Student already exists");
        } else {
          student = new Student({
            name,
            email,
            phoneNumber,
            enquiryStatus: true,
            enquiryDate: new Date(),
          });
        }
      }
      student.save();
      return res.status(200).send("Student enquiry created successfully");
    } catch (err) {
      return res.status(500).send(err.message);
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
      .isLength({ min: 2 })
      .withMessage("Name should be atleast 2 letter long"),
    check("phoneNumber")
      .not()
      .isEmpty()
      .withMessage("Please enter student's phone number")
      .isNumeric({ min: 10, max: 10 })
      .withMessage("Please enter a valid phone number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phoneNumber } = req.body;

    try {
      let student = await Student.findOne({ phoneNumber });
      if (student) {
        res.status(400).json({ errors: [{ msg: "Student already exists" }] });
      }

      if (!req.body.email) {
        student = new Student({
          name,
          phoneNumber,
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
            phoneNumber,
            enrollmentStatus: true,
            enrollmentDate: new Date(),
          });
        }
      }
      student.save();
      return res.status(200).send("Student enrollment created successfully");
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);

// @route  GET api/students
// @desc   Find a student by phone number
// @access Private

router.get("/find-student/:phoneNumber", verifyToken, async (req, res) => {
  try {
    const student = await Student.findOne({
      phoneNumber: req.params.phoneNumber,
    });

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    return res.status(200).json(student);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// @route  PUT api/students
// @desc   update the details of a student
// @access Private

router.put("/update-student/:phoneNumber", verifyToken, async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      enquiryStatus,
      enrollmentStatus,
      enquiryDate,
      enrollmentDate,
    } = req.body;
    const student = await Student.findOne({
      phoneNumber: req.params.phoneNumber,
    });

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    if (name) student.name = name;
    if (email) student.email = email;
    if (phone) student.phoneNumber = phoneNumber;
    if (enquiryStatus) student.enquiryStatus = enquiryStatus;
    if (enrollmentStatus) student.enrollmentStatus = enrollmentStatus;
    if (enquiryDate) student.enquiryDate = enquiryDate;
    if (enrollmentDate) student.enrollmentDate = enrollmentDate;

    return res.json({ msg: `Student data got updated` });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// @route  DELELTE api/students
// @desc   delete a student entry
// @access Private

router.delete("/delete-student/:phoneNumber", verifyToken, async (req, res) => {
  try {
    await Student.findOneAndDelete(
      { phoneNumber: req.params.phoneNumber },
      (err, result) => {
        if (result != null) {
          return res.status(200).json({ result });
        } else {
          return res.status(400).send("Student could not be deleted");
        }
      }
    );
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// @route  GET api/students
// @desc   get list of all the students
// @access Private

router.get("/list-students", verifyToken, async (req, res) => {
  try {
    const students = await Student.find((err, students) => {
      if (!students) {
        return res.status(404).json({ msg: "No data available" });
      }
    });
    return res.status(200).json(students);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// @route  GET api/students
// @desc   get list of all the students enquiries
// @access Private

router.get("/list-all-enquiries", verifyToken, async (req, res) => {
  try {
    const enrollmentFilter = { enquiryStatus: true };
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
    return res.status(200).json(enrolledStudents);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// @route  GET api/students
// @desc   get list of all the enrolled students
// @access Private

router.get("/list-all-enrollments", verifyToken, async (req, res, next) => {
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
    return res.json.status(200)(enrolledStudents);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// @route  GET api/students
// @desc   get all the enquires of last 30 days
// @access Private

router.get(
  "/list-all-enquiries-in-last-30-days",
  verifyToken,
  async (req, res) => {
    try {
      const currentDate = new Date();
      let thirtyDaysBefore = new Date();
      thirtyDaysBefore = thirtyDaysBefore.setDate(
        thirtyDaysBefore.getDate() - 30
      );

      fetchQuery = {
        enquiryDate: { $gte: thirtyDaysBefore, $lte: currentDate },
        enquiryStatus: true,
      };

      const numberOfEnquiriesInThirtyDays = await Student.find(
        fetchQuery,
        (err, numOfEnquiriesInThirtyDays) => {
          if (err || numOfEnquiriesInThirtyDays === 0) {
            return res.status(404).json({
              message: "No enquiries in last 30 days",
            });
          }
        }
      );
      res.status(200).json(numberOfEnquiriesInThirtyDays);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

// @route  GET api/students
// @desc   get all the enquires of last 90 days
// @access Private

router.get(
  "/list-all-enquiries-in-last-90-days",
  verifyToken,
  async (req, res) => {
    try {
      const currentDate = new Date();
      let ninetyDaysBefore = new Date();
      ninetyDaysBefore = ninetyDaysBefore.setDate(
        ninetyDaysBefore.getDate() - 90
      );

      fetchQuery = {
        enquiryDate: { $gte: ninetyDaysBefore, $lte: currentDate },
        enquiryStatus: true,
      };

      const listOfEnquiriesInNinetyDays = await Student.find(
        fetchQuery,
        (err, listOfEnquiriesInNinetyDays) => {
          if (err || listOfEnquiriesInNinetyDays === 0) {
            return res.status(404).json({
              message: "No enquiries in last 90 days",
            });
          }
        }
      );
      res.status(200).json(listOfEnquiriesInNinetyDays);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

// @route  GET api/students
// @desc   get all the enquires in last year
// @access Private

router.get(
  "/list-all-enquiries-in-last-year",
  verifyToken,
  async (req, res) => {
    try {
      const currentDate = new Date();
      let oneYearBefore = new Date();
      oneYearBefore = oneYearBefore.setDate(oneYearBefore.getDate() - 365);

      fetchQuery = {
        enquiryDate: { $gte: oneYearBefore, $lte: currentDate },
        enquiryStatus: true,
      };

      const listOfEnquiriesInLastYear = await Student.find(
        fetchQuery,
        (err, listOfEnquiriesInLastYear) => {
          if (err || listOfEnquiriesInLastYear === 0) {
            return res.status(404).json({
              message: "No enquiries in the last year",
            });
          }
        }
      );
      res.status(200).json(listOfEnquiriesInLastYear);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

// @route  GET api/students
// @desc   get number of all the students
// @access Private

router.get("/number-of-students", verifyToken, async (req, res) => {
  try {
    const numberOfStudents = await Student.countDocuments(
      (err, numOfStudents) => {
        if (err || numOfStudents === 0) {
          return res.status(404).json({
            message: "No students",
          });
        }
      }
    );
    return res.status(200).send(`Number of students: ${numberOfStudents}`);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// @route  GET api/students
// @desc   get number of all the enquiries
// @access Private

router.get("/number-of-enquiries", verifyToken, async (req, res) => {
  try {
    const numberOfEnquiries = await Student.countDocuments(
      { enquiryStatus: true },
      (err, numOfEnquiries) => {
        if (err || numOfEnquiries === 0) {
          return res.status(404).json({
            message: "No enquiries",
          });
        }
      }
    );
    return res.status(200).send(`Number of enquiries: ${numberOfEnquiries}`);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// @route  GET api/students
// @desc   get number of all the enrollments
// @access Private

router.get("/number-of-enrollments", verifyToken, async (req, res) => {
  try {
    const numberOfEnrollments = await Student.countDocuments(
      { enrollmentStatus: true },
      (err, numOfEnrollments) => {
        if (err || numOfEnrollments === 0) {
          return res.status(404).json({
            message: "No enrollments",
          });
        }
      }
    );
    return res
      .status(200)
      .send(`Number of enrollments: ${numberOfEnrollments}`);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// @route  GET api/students
// @desc   get all the enquires of last 30 days
// @access Private

router.get(
  "/number-of-enquiries-in-last-30-days",
  verifyToken,
  async (req, res) => {
    try {
      const currentDate = new Date();
      let thirtyDaysBefore = new Date();
      thirtyDaysBefore = thirtyDaysBefore.setDate(
        thirtyDaysBefore.getDate() - 30
      );

      fetchQuery = {
        enquiryDate: { $gte: thirtyDaysBefore, $lte: currentDate },
        enquiryStatus: true,
      };

      const numberOfEnquiriesInThirtyDays = await Student.countDocuments(
        fetchQuery,
        (err, numOfEnquiriesInThirtyDays) => {
          if (err || numOfEnquiriesInThirtyDays === 0) {
            return res.status(404).json({
              message: "No enquiries in last 30",
            });
          }
        }
      );
      res
        .status(200)
        .send(
          `Number of enquiries in last 30 days: ${numberOfEnquiriesInThirtyDays}`
        );
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

// @route  GET api/students
// @desc   get all the enquires of last 90 days
// @access Private

router.get(
  "/number-of-enquiries-in-last-90-days",
  verifyToken,
  async (req, res) => {
    try {
      const currentDate = new Date();
      let ninetyDaysBefore = new Date();
      ninetyDaysBefore = ninetyDaysBefore.setDate(
        ninetyDaysBefore.getDate() - 90
      );

      fetchQuery = {
        enquiryDate: { $gte: ninetyDaysBefore, $lte: currentDate },
        enquiryStatus: true,
      };

      const numberOfEnquiriesInNinetyDays = await Student.countDocuments(
        fetchQuery,
        (err, numOfEnquiriesInNinetyDays) => {
          if (err || numOfEnquiriesInNinetyDays === 0) {
            return res.status(404).json({
              message: "No enquiries in last 90",
            });
          }
        }
      );
      res
        .status(200)
        .send(
          `Number of enquiries in last 90 days: ${numberOfEnquiriesInNinetyDays}`
        );
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

// @route  POST api/students
// @desc   get all the enquires of year
// @access Private

router.get(
  "/number-of-enquiries-in-last-year",
  verifyToken,
  async (req, res) => {
    try {
      const currentDate = new Date();
      let oneYearBefore = new Date();
      oneYearBefore = oneYearBefore.setDate(oneYearBefore.getDate() - 365);

      fetchQuery = {
        enquiryDate: { $gte: oneYearBefore, $lte: currentDate },
      };

      const numberOfEnquiriesInLastYear = await Student.countDocuments(
        fetchQuery,
        { enquiryStatus: true },
        (err, numOfEnquiriesInLastYear) => {
          if (err || numOfEnquiriesInLastYear === 0) {
            return res.status(404).json({
              message: "No enquiries in last year",
            });
          }
        }
      );
      res
        .status(200)
        .send(
          `Number of enquiries in last year: ${numberOfEnquiriesInLastYear}`
        );
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

// @route  GET api/students
// @desc   get all the enrollments in last 30 days
// @access Private

router.get(
  "/number-of-enrollments-in-last-30-days",
  verifyToken,
  async (req, res) => {
    try {
      const currentDate = new Date();
      let thirtyDaysBefore = new Date();
      thirtyDaysBefore = thirtyDaysBefore.setDate(
        thirtyDaysBefore.getDate() - 30
      );

      fetchQuery = {
        enquiryDate: { $gte: thirtyDaysBefore, $lte: currentDate },
        enrollmentStatus: true,
      };

      const numberOfEnrollmentsInThirtyDays = await Student.countDocuments(
        fetchQuery,
        (err, numOfEnrollmentsInThirtyDays) => {
          if (err || numOfEnrollmentsInThirtyDays === 0) {
            return res.status(404).json({
              message: "No enrollments in last 30 days",
            });
          }
        }
      );
      res
        .status(200)
        .send(
          `Number of enrollments in last 30 days: ${numberOfEnrollmentsInThirtyDays}`
        );
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

// @route  GET api/students
// @desc   get all the enrollments in last 90 days
// @access Private

router.get(
  "/number-of-enrollments-in-last-90-days",
  verifyToken,
  async (req, res) => {
    try {
      const currentDate = new Date();
      let ninetyDaysBefore = new Date();
      ninetyDaysBefore = ninetyDaysBefore.setDate(
        ninetyDaysBefore.getDate() - 90
      );

      fetchQuery = {
        enquiryDate: { $gte: ninetyDaysBefore, $lte: currentDate },
        enrollmentStatus: true,
      };

      const numberOfEnrollmentsInNinetyDays = await Student.countDocuments(
        fetchQuery,
        (err, numOfEnrollmentsInNinetyDays) => {
          if (err || numOfEnrollmentsInNinetyDays === 0) {
            return res.status(404).json({
              message: "No enrollments in last 30 days",
            });
          }
        }
      );
      res
        .status(200)
        .send(
          `Number of enrollments in last 90 days: ${numberOfEnrollmentsInNinetyDays}`
        );
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

// @route  GET api/students
// @desc   get the number the enrollments in last one year
// @access Private

router.get(
  "/number-of-enrollments-in-last-year",
  verifyToken,
  async (req, res) => {
    try {
      const currentDate = new Date();
      let oneYearBefore = new Date();
      oneYearBefore = oneYearBefore.setDate(oneYearBefore.getDate() - 365);

      fetchQuery = {
        enquiryDate: { $gte: ninetyDaysBefore, $lte: currentDate },
      };

      const numberOfEnrollmentsInLastYear = await Student.countDocuments(
        fetchQuery,
        { enrollmentStatus: true },
        (err, numOfEnrollmentsInNinetyDays) => {
          if (err || numOfEnrollmentsInNinetyDays === 0) {
            return res.status(404).json({
              message: "No enrollments in last 30 days",
            });
          }
        }
      );
      res
        .status(200)
        .send(
          `Number of enrollments in last 90 days: ${numberOfEnrollmentsInLastYear}`
        );
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

module.exports = router;
