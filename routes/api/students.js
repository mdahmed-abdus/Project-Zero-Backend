const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth");
const { check, validationResult, body } = require("express-validator");
const Student = require("../../Models/student");

// @route  POST api/admin/students
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
    check("year").not().isEmpty().withMessage("Year should not be empty"),
    check("course").not().isEmpty().withMessage("Course should not be empty"),
    check("college").not().isEmpty().withMessage("College should not be empty"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(406)
        .json({ errors: errors.array({ onlyFirstError: true }) });
    }
    const {
      name,
      email,
      phoneNumber,
      enquiryStatus,
      enrollmentStatus,
      year,
      course,
      college,
      offeredFees,
      actualFees,
    } = req.body;
    console.log(req.body);
    try {
      let studentPhone = await Student.findOne({ phoneNumber });
      if (studentPhone) {
        return res
          .status(400)
          .json({ error: { message: "Student already exists" } });
      }

      if (!req.body.email) {
        if (req.body.enquiryStatus) {
          student = new Student({
            name,
            phoneNumber,
            enquiryStatus: req.body.enquiryStatus,
            isEnquiryActive: true,
            enquiryDate: new Date(),
            year,
            course,
            college,
            offeredFees,
            actualFees,
          });
        }
        if (req.body.enrollmentStatus) {
          student = new Student({
            name,
            phoneNumber,
            enrollmentStatus,
            isEnrollmentActive: true,
            enrollmentDate: new Date(),
            year,
            course,
            college,
            offeredFees,
            actualFees,
          });
        }

        if (req.body.enquiryStatus && req.body.enrollmentStatus) {
          student = new Student({
            name,
            phoneNumber,
            enquiryStatus,
            isEnquiryActive: true,
            enrollmentStatus,
            isEnrollmentActive: true,
            enquiryDate: new Date(),
            enrollmentDate: new Date(),
            year,
            course,
            college,
            offeredFees,
            actualFees,
          });
        } else {
          student = new Student({ name, phoneNumber, year, course, college });
        }
      } else {
        req.body("email").isEmail().withMessage("Please enter a valid email");
        let studentEmail = await Student.findOne({ email });
        if (studentEmail) {
          return res
            .status(400)
            .json({ error: { message: "Student already exists" } });
        }
        if (req.body.enquiryStatus == true) {
          student = new Student({
            name,
            email,
            phoneNumber,
            enquiryStatus,
            isEnquiryActive: true,
            enquiryDate: new Date(),
            year,
            course,
            college,
            offeredFees,
            actualFees,
          });
        }
        if (req.body.enrollmentStatus) {
          student = new Student({
            name,
            email,
            phoneNumber,
            enrollmentStatus,
            isEnrollmentActive: true,
            enrollmentDate: new Date(),
            year,
            course,
            college,
            offeredFees,
            actualFees,
          });
        }

        if (req.body.enquiryStatus && req.body.enrollmentStatus) {
          student = new Student({
            name,
            email,
            phoneNumber,
            enquiryStatus,
            isEnquiryActive: true,
            enrollmentStatus,
            isEnrollmentActive: true,
            enquiryDate: new Date(),
            enrollmentDate: new Date(),
            year,
            course,
            college,
            offeredFees,
            actualFees,
          });
        } else {
          student = new Student({
            name,
            email,
            phoneNumber,
            year,
            course,
            college,
            offeredFees,
            actualFees,
          });
        }
      }
      await student.save();
      return res.status(200).json(student);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
);

// @route  POST api/admin/students
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
    check("offeredFees")
      .not()
      .isEmpty()
      .withMessage("Enter the offered fees")
      .isNumeric()
      .withMessage("Fees should be in number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array({ onlyFirstError: true }) });
    }
    const { name, email, phoneNumber, year, course, college, offeredFees } =
      req.body;

    try {
      let student = await Student.findOne({ phoneNumber });
      if (student) {
        return res
          .status(400)
          .json({ error: { msg: "Student already exists" } });
      }

      if (!req.body.email) {
        student = new Student({
          name,
          phoneNumber,
          enquiryStatus: true,
          isEnquiryActive: true,
          enquiryDate: new Date(),
          year,
          course,
          college,
          offeredFees,
        });
      } else {
        body("email").isEmail().withMessage("Please enter a valid email");
        let studentEmail = await Student.findOne({ email });
        if (studentEmail) {
          return res.status(400).send("Student already exists");
        } else {
          student = new Student({
            name,
            email,
            phoneNumber,
            enquiryStatus: true,
            isEnquiryActive: true,
            enquiryDate: new Date(),
            year,
            course,
            college,
            offeredFees,
          });
        }
      }
      await student.save();
      return res.status(200).json(student);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
);

// @route  POST api/admin/students
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
    check("offeredFees")
      .not()
      .isEmpty()
      .withMessage("Enter the offered fees")
      .isNumeric()
      .withMessage("Fees should be in number"),
    check("actualFees")
      .not()
      .isEmpty()
      .withMessage("Enter the actual fees")
      .isNumeric()
      .withMessage("Fees should be in number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phoneNumber, year, course, college } = req.body;

    try {
      let student = await Student.findOne({ phoneNumber });
      if (student) {
        res.status(400).json({ error: { msg: "Something went wrong" } });
      }

      if (!req.body.email) {
        student = new Student({
          name,
          phoneNumber,
          enrollmentStatus: true,
          isEnrollmentActive: true,
          enrollmentDate: new Date(),
          year,
          course,
          college,
          offeredFees,
          actualFees,
        });
      } else {
        body("email").isEmail().withMessage("Please enter a valid email");
        let studentEmail = await Student.findOne({ email });
        if (studentEmail) {
          res.status(400).json({ error: { msg: "Student already exists" } });
        } else {
          student = new Student({
            name,
            email,
            phoneNumber,
            enrollmentStatus: true,
            isEnrollmentActive: true,
            enrollmentDate: new Date(),
            year,
            course,
            college,
            offeredFees,
            actualFees,
          });
        }
      }
      await student.save();
      return res.status(200).json(student);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
);

// @route PUT api/admin/students
// @desc convert a student enquiry to enrollment
// @access Private

router.put("/enquiry-to-enrollment/:id", verifyToken, async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id });
    student.enquiryStatus = false;
    student.isEnquiryActive = false;
    student.enrollmentStatus = true;
    student.isEnrollmentActive = true;

    await student.save();

    return res.status(200).json(student);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

// @route  GET api/admin/students
// @desc   Find a student by phone number
// @access Private

router.get("/find-student/:phoneNumber", verifyToken, async (req, res) => {
  try {
    const student = await Student.findOne({
      phoneNumber: req.params.phoneNumber,
    });

    if (!student) {
      return res.status(404).json({ error: { msg: "Student already exists" } });
    }

    return res.status(200).json(student);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

// @route  PUT api/admin/students
// @desc   update the details of a student
// @access Private

router.put("/update-student/:phoneNumber", verifyToken, async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      enquiryStatus,
      isEnquiryActive,
      enquiryDate,
      enrollmentStatus,
      isEnrollmentActive,
      enrollmentDate,
      year,
      course,
      college,
    } = req.body;
    const student = await Student.findOne({
      phoneNumber: req.params.phoneNumber,
    });

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    if (name) student.name = name;
    if (email) student.email = email;
    if (phoneNumber) student.phoneNumber = phoneNumber;
    if (enquiryStatus) {
      student.enquiryStatus = enquiryStatus;
      if (enquiryStatus === true) {
        student.isEnquiryActive = true;
      }
    }
    if (enrollmentStatus) {
      student.enrollmentStatus = enrollmentStatus;
      if (enrollmentStatus === true) {
        student.isEnrollmentActive = true;
      }
    }
    if (isEnquiryActive) student.isEnquiryActive = isEnquiryActive;
    if (isEnrollmentActive) student.isEnrollmentActive = isEnrollmentActive;
    if (enquiryDate) student.enquiryDate = enquiryDate;
    if (enrollmentDate) student.enrollmentDate = enrollmentDate;
    if (year) student.year = year;
    if (course) student.course = course;
    if (college) student.college = college;

    await student.save();
    return res.json(student);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

// @route  DELELTE api/admin/students
// @desc   delete a student entry
// @access Private

router.delete("/delete-student/:phoneNumber", verifyToken, async (req, res) => {
  try {
    await Student.findOneAndDelete(
      { phoneNumber: req.params.phoneNumber },
      (err, deletedStudent) => {
        if (null !== deletedStudent) {
          return res.status(200).json(deletedStudent);
        } else {
          return res
            .status(400)
            .json({ error: { message: "Something went wrong" } });
        }
      }
    );
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

// @route  GET api/admin/students
// @desc   get list of all the students
// @access Private

router.get("/list-students", verifyToken, async (req, res) => {
  try {
    const listOfStudents = await Student.find((err, students) => {
      if (!students || err) {
        console.log(err);
        return res.status(404).json({ msg: "Something went wrong" });
      }
    }).sort({ date: -1 });
    return res.status(200).json(listOfStudents);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

// @route  GET api/admin/students
// @desc   get list of all the students enquiries
// @access Private

router.get("/list-all-enquiries", verifyToken, async (req, res) => {
  try {
    const enquiryFilter = { enquiryStatus: true };
    const listOfEnquiries = await Student.find(
      enquiryFilter,
      (err, listOfEnquiries) => {
        if (!listOfEnquiries) {
          return res.status(404).json({
            msg: "No enrolled students",
          });
        }
      }
    ).sort({ enquiryDate: -1 });
    return res.status(200).json(listOfEnquiries);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

// @route  GET api/admin/students
// @desc   get list of all the enrolled students
// @access Private

router.get("/list-all-enrollments", verifyToken, async (req, res, next) => {
  try {
    const enrollmentFilter = { enrollmentStatus: true };
    const listOfEnrollments = await Student.find(
      enrollmentFilter,
      (err, listOfEnrollments) => {
        if (!listOfEnrollments) {
          return res.status(404).json({
            msg: "No enrolled students",
          });
        }
      }
    ).sort({ enrollmentDate: -1 });
    return res.json.status(200)(listOfEnrollments);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

// @route  GET api/admin/students
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

      const listOfEnquiriesInThirtyDays = await Student.find(
        fetchQuery,
        (err) => {
          if (err) {
            return res.status(404).json(err);
          }
        }
      ).sort({ enquiryDate: -1 });
      return res.status(200).json(listOfEnquiriesInThirtyDays);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);

// @route  GET api/admin/students
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
        (err) => {
          if (err) {
            return res.status(404).json(err);
          }
        }
      ).sort({ enquiryDate: -1 });
      return res.status(200).json(listOfEnquiriesInNinetyDays);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);

// @route  GET api/admin/students
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
        (err) => {
          if (err || listOfEnquiriesInLastYear === 0) {
            return res.status(404).json(err);
          }
        }
      ).sort({ enquiryDate: -1 });
      return res.status(200).json(listOfEnquiriesInLastYear);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
);

// @route  GET api/admin/students
// @desc   get all the enrollments of last 30 days
// @access Private

router.get(
  "/list-all-enrollments-in-last-30-days",
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

      const listOfEnrollmentsInThirtyDays = await Student.find(
        fetchQuery,
        (err) => {
          if (err) {
            return res.status(404).json(err);
          }
        }
      ).sort({ enrollmentDate: -1 });
      return res.status(200).json(listOfEnrollmentsInThirtyDays);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
);

// @route  GET api/admin/students
// @desc   get all the enquires of last 90 days
// @access Private

router.get(
  "/list-all-enrollments-in-last-90-days",
  verifyToken,
  async (req, res) => {
    try {
      const currentDate = new Date();
      let ninetyDaysBefore = new Date();
      ninetyDaysBefore = ninetyDaysBefore.setDate(
        ninetyDaysBefore.getDate() - 90
      );

      fetchQuery = {
        enrollmentDate: { $gte: ninetyDaysBefore, $lte: currentDate },
        enrollmentStatus: true,
      };

      const listOfEnrollmentsInNinetyDays = await Student.find(
        fetchQuery,
        (err) => {
          if (err) {
            return res.status(404).json(err);
          }
        }
      ).sort({ enrollmentDate: -1 });
      return res.status(200).json(listOfEnrollmentsInNinetyDays);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
);

// @route  GET api/admin/students
// @desc   get all the enquires in last year
// @access Private

router.get(
  "/list-all-enrollments-in-last-year",
  verifyToken,
  async (req, res) => {
    try {
      const currentDate = new Date();
      let oneYearBefore = new Date();
      oneYearBefore = oneYearBefore.setDate(oneYearBefore.getDate() - 365);

      fetchQuery = {
        enrollmentDate: { $gte: oneYearBefore, $lte: currentDate },
        enrollmentStatus: true,
      };

      const listOfEnrollmentsInLastYear = await Student.find(
        fetchQuery,
        (err) => {
          if (err) {
            return res.status(404).json(err);
          }
        }
      ).sort({ enrollmentDate: -1 });
      return res.status(200).json(listOfEnrollmentsInLastYear);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

// @route  GET api/admin/students
// @desc   get number of all the students
// @access Private

router.get("/number-of-students", async (req, res) => {
  try {
    await Student.countDocuments((err, numberOfStudents) => {
      if (!err) {
        return res.status(200).json(numberOfStudents);
      } else {
        return res.status(400).json(err);
      }
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// @route  GET api/admin/students
// @desc   get number of all the enquiries
// @access Private

router.get("/number-of-enquiries", async (req, res) => {
  try {
    await Student.countDocuments(
      { enquiryStatus: true },
      (err, numberOfEnquiries) => {
        if (!err) {
          return res.status(200).json(numberOfEnquiries);
        } else {
          return res.status(400).json(err);
        }
      }
    );
  } catch (err) {
    return res.status(500).json(err);
  }
});

// @route  GET api/admin/students
// @desc   get number of all the enrollments
// @access Private

router.get("/number-of-enrollments", async (req, res) => {
  try {
    await Student.countDocuments(
      { enquiryStatus: true },
      (err, numberOfEnrollments) => {
        if (!err) {
          return res.status(200).json(numberOfEnrollments);
        } else {
          return res.status(400).json(err);
        }
      }
    );
  } catch (err) {
    return res.status(500).json(err);
  }
});

// @route  GET api/admin/students
// @desc   get all the enquires of last 30 days
// @access Private

router.get(
  "/number-of-enquiries-in-last-30-days",

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

      await Student.countDocuments(
        fetchQuery,
        (err, numberOfEnquiriesInThirtyDays) => {
          if (!err || numberOfEnquiriesInThirtyDays !== 0) {
            return res.status(200).json(numberOfEnquiriesInThirtyDays);
          }
        }
      );
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
);

// @route  GET api/admin/students
// @desc   get all the enquires of last 90 days
// @access Private

router.get(
  "/number-of-enquiries-in-last-90-days",

  async (req, res) => {
    try {
      const currentDate = new Date();
      let ninetyDaysBefore = new Date();
      ninetyDaysBefore = ninetyDaysBefore.setDate(
        ninetyDaysBefore.getDate() - 30
      );

      fetchQuery = {
        enquiryDate: { $gte: ninetyDaysBefore, $lte: currentDate },
        enquiryStatus: true,
      };

      await Student.countDocuments(
        fetchQuery,
        (err, numberOfEnquiriesInNinetyDays) => {
          if (!err) {
            return res.status(200).json(numberOfEnquiriesInNinetyDays);
          } else {
            return res.status(400).json(err);
          }
        }
      );
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
);

// @route  POST api/admin/students
// @desc   get all the enquires of year
// @access Private

router.get(
  "/number-of-enquiries-in-last-year",

  async (req, res) => {
    try {
      const currentDate = new Date();
      let oneYearBefore = new Date();
      oneYearBefore = oneYearBefore.setDate(oneYearBefore.getDate() - 365);

      fetchQuery = {
        enquiryDate: { $gte: oneYearBefore, $lte: currentDate },
        enquiryStatus: true,
      };

      await Student.countDocuments(
        fetchQuery,
        (err, numberOfEnquiriesInLastYear) => {
          if (!err) {
            return res.status(200).json(numberOfEnquiriesInLastYear);
          } else {
            return res.status(400).json(err);
          }
        }
      );
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
);

// @route  GET api/admin/students
// @desc   get all the enrollments in last 30 days
// @access Private

router.get(
  "/number-of-enrollments-in-last-30-days",

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

      await Student.countDocuments(
        fetchQuery,
        (err, numberOfEnrollmentsInLastThirtyDays) => {
          if (!err) {
            return res.status(200).json(numberOfEnrollmentsInLastThirtyDays);
          } else {
            return res.status(400).json(err);
          }
        }
      );
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
);

// @route  GET api/admin/students
// @desc   get all the enrollments in last 90 days
// @access Private

router.get(
  "/number-of-enrollments-in-last-90-days",

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

      await Student.countDocuments(
        fetchQuery,
        (err, numberOfEnrollmentsInLastNinetyDays) => {
          if (!err) {
            return res.status(200).json(numberOfEnrollmentsInLastNinetyDays);
          } else {
            return res.status(400).json(err);
          }
        }
      );
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

// @route  GET api/admin/students
// @desc   get all the enrollments in last one year
// @access Private

router.get(
  "/number-of-enrollments-in-last-year",

  async (req, res) => {
    try {
      const currentDate = new Date();
      let oneYearBefore = new Date();
      oneYearBefore = oneYearBefore.setDate(oneYearBefore.getDate() - 90);

      fetchQuery = {
        enquiryDate: { $gte: oneYearBefore, $lte: currentDate },
        enquiryStatus: true,
      };

      await Student.countDocuments(
        fetchQuery,
        (err, numberOfEnrollmentsInLastYear) => {
          if (!err) {
            return res.status(200).json(numberOfEnrollmentsInLastYear);
          } else {
            return res.status(400).json(err);
          }
        }
      );
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

module.exports = router;
