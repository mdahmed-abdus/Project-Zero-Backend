const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth');
const Student = require('../../Models/student');
const {
  createStudentSchema,
  createEnquirySchema,
  createEnrollmentSchema,
  updateStudentSchema,
} = require('../../validators/studentValidator');

// @route  POST api/admin/students
// @desc   Create a student
// @access Private
router.post('/create-student', verifyToken, async (req, res) => {
  try {
    const { error: validationError } = createStudentSchema.validate(req.body);
    if (validationError) {
      return res.status(404).send(validationError.details[0].message);
    }

    const { email, phoneNumber, enquiryStatus, enrollmentStatus } = req.body;

    if (await Student.findOne({ phoneNumber })) {
      return res.status(400).send('Student already exists');
    }

    if (email) {
      if (await Student.findOne({ email })) {
        return res.status(400).send('Student already exists');
      }
    }

    let options = { ...req.body };

    if (enquiryStatus) {
      options = {
        ...options,
        isEnquiryActive: true,
        enquiryDate: new Date(),
      };
    }

    if (enrollmentStatus) {
      options = {
        ...options,
        isEnrollmentActive: true,
        enrollmentDate: new Date(),
      };
    }

    const student = new Student(options);
    await student.save();

    res.status(200).json(student);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// @route  POST api/admin/students
// @desc   Create a student enquiry
// @access Private
router.post('/create-enquiry', verifyToken, async (req, res) => {
  try {
    const { error: validationError } = createEnquirySchema.validate(req.body);
    if (validationError) {
      return res.status(404).send(validationError.details[0].message);
    }

    const { email, phoneNumber } = req.body;

    if (await Student.findOne({ phoneNumber })) {
      return res.status(400).send('Student already exists');
    }

    if (email) {
      if (await Student.findOne({ email })) {
        return res.status(400).send('Student already exists');
      }
    }

    const student = new Student({
      ...req.body,
      enquiryStatus: true,
      isEnquiryActive: true,
      enquiryDate: new Date(),
    });
    await student.save();

    res.status(200).json(student);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// @route  POST api/admin/students
// @desc   Create enrollment for a student
// @access Private
router.post('/create-enrollment', verifyToken, async (req, res) => {
  try {
    const { error: validationError } = createEnrollmentSchema.validate(
      req.body
    );
    if (validationError) {
      return res.status(404).send(validationError.details[0].message);
    }

    const { email, phoneNumber } = req.body;

    if (await Student.findOne({ phoneNumber })) {
      res.status(400).send('Something went wrong');
    }

    if (email) {
      if (await Student.findOne({ email })) {
        res.status(400).send('Student already exists');
      }
    }

    const student = new Student({
      ...req.body,
      enrollmentStatus: true,
      isEnrollmentActive: true,
      enrollmentDate: new Date(),
    });
    await student.save();

    return res.status(200).json(student);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

// @route PUT api/admin/students
// @desc convert a student enquiry to enrollment
// @access Private
router.put('/enquiry-to-enrollment/:id', verifyToken, async (req, res) => {
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
router.get('/find-student/:phoneNumber', verifyToken, async (req, res) => {
  try {
    const student = await Student.findOne({
      phoneNumber: req.params.phoneNumber,
    });

    if (!student) {
      return res.status(404).json({ error: { msg: 'Student already exists' } });
    }

    return res.status(200).json(student);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

// @route  PUT api/admin/students
// @desc   update the details of a student
// @access Private
router.put('/update-student/:phoneNumber', verifyToken, async (req, res) => {
  try {
    const { error: validationError } = updateStudentSchema.validate(req.body);
    if (validationError) {
      return res.status(404).send(validationError.details[0].message);
    }

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
      return res.status(404).json({ msg: 'Student not found' });
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

// @route  DELETE api/admin/students
// @desc   delete a student entry
// @access Private
router.delete('/delete-student/:phoneNumber', verifyToken, async (req, res) => {
  try {
    await Student.findOneAndDelete(
      { phoneNumber: req.params.phoneNumber },
      (err, deletedStudent) => {
        if (null !== deletedStudent) {
          return res.status(200).json(deletedStudent);
        } else {
          return res
            .status(400)
            .json({ error: { message: 'Something went wrong' } });
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
router.get('/list-students', verifyToken, async (req, res) => {
  try {
    const listOfStudents = await Student.find((err, students) => {
      if (!students || err) {
        return res.status(404).json({ msg: 'Something went wrong' });
      }
    });
    res.status(200).json(listOfStudents);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// @route  GET api/admin/students
// @desc   get list of all the students enquiries
// @access Private
router.get('/list-all-enquiries', verifyToken, async (req, res) => {
  try {
    const enquiryFilter = { enquiryStatus: true };
    const listOfEnquiries = await Student.find(
      enquiryFilter,
      (err, listOfEnquiries) => {
        if (!listOfEnquiries) {
          return res.status(404).json({
            msg: 'No enrolled students',
          });
        }
      }
    );
    res.status(200).json(listOfEnquiries);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// @route  GET api/admin/students
// @desc   get list of all the enrolled students
// @access Private
router.get('/list-all-enrollments', verifyToken, async (req, res, next) => {
  try {
    const enrollmentFilter = { enrollmentStatus: true };
    const listOfEnrollments = await Student.find(
      enrollmentFilter,
      (err, listOfEnrollments) => {
        if (!listOfEnrollments) {
          return res.status(404).json({
            msg: 'No enrolled students',
          });
        }
      }
    );
    res.json.status(200)(listOfEnrollments);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// @route  GET api/admin/students
// @desc   get all the enquires of last 30 days
// @access Private
router.get(
  '/list-all-enquiries-in-last-30-days',
  verifyToken,
  async (req, res) => {
    try {
      const currentDate = new Date();
      const thirtyDaysBefore = new Date().setDate(
        thirtyDaysBefore.getDate() - 30
      );

      fetchQuery = {
        enquiryDate: { $gte: thirtyDaysBefore, $lte: currentDate },
        enquiryStatus: true,
      };

      const listOfEnquiriesInThirtyDays = await Student.find(
        fetchQuery,
        (err, listOfEnquiriesInThirtyDays) => {
          if (err || listOfEnquiriesInThirtyDays === 0) {
            return res.status(404).json({
              message: 'No enquiries in last 30 days',
            });
          }
        }
      );
      res.status(200).json(listOfEnquiriesInThirtyDays);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

// @route  GET api/admin/students
// @desc   get all the enquires of last 90 days
// @access Private
router.get(
  '/list-all-enquiries-in-last-90-days',
  verifyToken,
  async (req, res) => {
    try {
      const currentDate = new Date();
      const ninetyDaysBefore = new Date().setDate(
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
              message: 'No enquiries in last 90 days',
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

// @route  GET api/admin/students
// @desc   get all the enquires in last year
// @access Private
router.get(
  '/list-all-enquiries-in-last-year',
  verifyToken,
  async (req, res) => {
    try {
      const currentDate = new Date();
      const oneYearBefore = new Date().setDate(oneYearBefore.getDate() - 365);

      fetchQuery = {
        enquiryDate: { $gte: oneYearBefore, $lte: currentDate },
        enquiryStatus: true,
      };

      const listOfEnquiriesInLastYear = await Student.find(
        fetchQuery,
        (err, listOfEnquiriesInLastYear) => {
          if (err || listOfEnquiriesInLastYear === 0) {
            return res.status(404).json({
              message: 'No enquiries in the last year',
            });
          }
        }
      );
      res.status(200).json(listOfEnquiriesInLastYear);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
);

// @route  GET api/admin/students
// @desc   get number of all the students
// @access Private
router.get('/number-of-students', verifyToken, async (req, res) => {
  try {
    await Student.countDocuments((err, numOfStudents) => {
      if (!err || numOfStudents !== 0) {
        return res.status(200).json(numberOfStudents);
      }
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// @route  GET api/admin/students
// @desc   get number of all the enquiries
// @access Private
router.get('/number-of-enquiries', verifyToken, async (req, res) => {
  try {
    const numberOfEnquiries = await Student.countDocuments(
      { enquiryStatus: true },
      (err, numOfEnquiries) => {
        if (!err || numOfEnquiries !== 0) {
          return res.status(200).json(numberOfEnquiries);
        }
      }
    );
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// @route  GET api/admin/students
// @desc   get number of all the enrollments
// @access Private
router.get('/number-of-enrollments', verifyToken, async (req, res) => {
  try {
    await Student.countDocuments(
      { enrollmentStatus: true },
      (err, numberOfEnrollments) => {
        if (!err || numberOfEnrollments !== 0) {
          return res.status(200).json(numberOfEnrollments);
        }
      }
    );
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// @route  GET api/admin/students
// @desc   get all the enquires of last 30 days
// @access Private
router.get(
  '/number-of-enquiries-in-last-30-days',
  verifyToken,
  async (req, res) => {
    try {
      const currentDate = new Date();
      const thirtyDaysBefore = new Date().setDate(
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
            res.status(200).json(numberOfEnquiriesInThirtyDays);
          }
        }
      );
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
);

// @route  GET api/admin/students
// @desc   get all the enquires of last 90 days
// @access Private
router.get(
  '/number-of-enquiries-in-last-90-days',
  verifyToken,
  async (req, res) => {
    try {
      const currentDate = new Date();
      const ninetyDaysBefore = new Date().setDate(
        ninetyDaysBefore.getDate() - 90
      );

      fetchQuery = {
        enquiryDate: { $gte: ninetyDaysBefore, $lte: currentDate },
        enquiryStatus: true,
      };

      await Student.countDocuments(
        fetchQuery,
        (err, numberOfEnquiriesInNinetyDays) => {
          if (err || numberOfEnquiriesInNinetyDays === 0) {
            res.status(200).json(numberOfEnquiriesInNinetyDays);
          }
        }
      );
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
);

// @route  POST api/students
// @desc   get all the enquires of year
// @access Private
router.get(
  '/number-of-enquiries-in-last-year',
  verifyToken,
  async (req, res) => {
    try {
      const currentDate = new Date();
      const oneYearBefore = new Date().setDate(oneYearBefore.getDate() - 365);

      fetchQuery = {
        enquiryDate: { $gte: oneYearBefore, $lte: currentDate },
        enquiryStatus: true,
      };

      const numberOfEnquiriesInLastYear = await Student.countDocuments(
        fetchQuery,
        (err, numOfEnquiriesInLastYear) => {
          if (!err || numOfEnquiriesInLastYear === 0) {
            return res.status(400).json(err);
          }
        }
      );
      res
        .status(200)
        .json(
          `Number of enquiries in last year: ${numberOfEnquiriesInLastYear}`
        );
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
);

// @route  GET api/admin/students
// @desc   get all the enrollments in last 30 days
// @access Private
router.get(
  '/number-of-enrollments-in-last-30-days',
  verifyToken,
  async (req, res) => {
    try {
      const currentDate = new Date();
      const thirtyDaysBefore = new Date().setDate(
        thirtyDaysBefore.getDate() - 30
      );

      fetchQuery = {
        enquiryDate: { $gte: thirtyDaysBefore, $lte: currentDate },
        enrollmentStatus: true,
      };

      const numberOfEnrollmentsInThirtyDays = await Student.countDocuments(
        fetchQuery,
        (err, numOfEnrollmentsInThirtyDays) => {
          if (err) {
            return res.status(400).json(err);
          }
          if (numOfEnrollmentsInThirtyDays === 0) {
            return res.status(404).json({
              message: 'No enrollments in last 30 days',
            });
          }
        }
      );
      res
        .status(200)
        .json(
          `Number of enrollments in last 30 days: ${numberOfEnrollmentsInThirtyDays}`
        );
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
);

// @route  GET api/admin/students
// @desc   get all the enrollments in last 90 days
// @access Private
router.get(
  '/number-of-enrollments-in-last-90-days',
  verifyToken,
  async (req, res) => {
    try {
      const currentDate = new Date();
      const ninetyDaysBefore = new Date().setDate(
        ninetyDaysBefore.getDate() - 90
      );

      fetchQuery = {
        enquiryDate: { $gte: ninetyDaysBefore, $lte: currentDate },
        enrollmentStatus: true,
      };

      const numberOfEnrollmentsInNinetyDays = await Student.countDocuments(
        fetchQuery,
        (err, numOfEnrollmentsInNinetyDays) => {
          if (err) {
            return res.status(400).json(err);
          }
          if (numOfEnrollmentsInNinetyDays === 0) {
            return res.status(404).json({
              message: 'No enrollments in last 30 days',
            });
          }
        }
      );
      res.status(200).json(numberOfEnrollmentsInNinetyDays);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
);

// @route  GET api/admin/students
// @desc   get the number the enrollments in last one year
// @access Private
router.get(
  '/number-of-enrollments-in-last-year',
  verifyToken,
  async (req, res) => {
    try {
      const currentDate = new Date();
      const oneYearBefore = new Date().setDate(oneYearBefore.getDate() - 365);

      fetchQuery = {
        enquiryDate: { $gte: oneYearBefore, $lte: currentDate },
        enrollmentStatus: true,
      };

      const numberOfEnrollmentsInLastYear = await Student.countDocuments(
        fetchQuery,
        (err, numOfEnrollmentsInLastYear) => {
          if (err) {
            return res.status(400).json(err);
          }
          if (numOfEnrollmentsInLastYear === 0) {
            return res.status(404).json({
              message: 'No enrollments in last 30 days',
            });
          }
        }
      );
      res.status(200).json(numberOfEnrollmentsInLastYear);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
);

module.exports = router;
