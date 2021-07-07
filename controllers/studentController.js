const Student = require("../Models/student");
const {
  createStudentSchema,
  createEnquirySchema,
  createEnrollmentSchema,
  updateStudentSchema,
} = require("../validators/studentValidator");

// @route  POST api/admin/students
// @desc   Create a student
// @access Private

exports.createStudent = async (req, res) => {
  try {
    const { error: validationError } = createStudentSchema.validate(req.body);
    if (validationError) {
      return res.status(404).json(validationError.details[0].message);
    }

    const { email, phoneNumber, enquiryStatus, enrollmentStatus } = req.body;

    if (await Student.findOne({ phoneNumber })) {
      return res.status(400).json("Student already exists");
    }

    if (email) {
      if (await Student.findOne({ email })) {
        return res.status(400).json("Student already exists");
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

    return res.status(200).json(student);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// @route  POST api/admin/students
// @desc   Create a student enquiry
// @access Private

exports.createEnquiry = async (req, res) => {
  try {
    const { error: validationError } = createEnquirySchema.validate(req.body);
    if (validationError) {
      return res.status(404).send(validationError.details[0].message);
    }

    const { email, phoneNumber } = req.body;

    if (await Student.findOne({ phoneNumber })) {
      return res.status(400).json("Student already exists");
    }

    if (email) {
      if (await Student.findOne({ email })) {
        return res.status(400).json("Student already exists");
      }
    }

    const student = new Student({
      ...req.body,
      enquiryStatus: true,
      isEnquiryActive: true,
      enquiryDate: new Date(),
    });
    await student.save();

    return res.status(200).json(student);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// @route  POST api/admin/students
// @desc   Create enrollment for a student
// @access Private

exports.createEnrollment = async (req, res) => {
  try {
    const { error: validationError } = createEnrollmentSchema.validate(
      req.body
    );
    if (validationError) {
      return res.status(404).json(validationError.details[0].message);
    }

    const { email, phoneNumber } = req.body;

    if (await Student.findOne({ phoneNumber })) {
      res.status(400).json("Something went wrong");
    }

    if (email) {
      if (await Student.findOne({ email })) {
        res.status(400).json("Student already exists");
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
    return res.status(500).json(err);
  }
};

// @route PUT api/admin/students
// @desc convert a student enquiry to enrollment
// @access Private

exports.enquiryToEnrollement = async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id });
    student.enquiryStatus = false;
    student.isEnquiryActive = false;
    student.enrollmentStatus = true;
    student.isEnrollmentActive = true;

    await student.save();

    return res.status(200).json(student);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// @route  GET api/admin/students
// @desc   Find a student by phone number
// @access Private

exports.findStudent = async (req, res) => {
  try {
    const student = await Student.findOne({
      phoneNumber: req.params.phoneNumber,
    });

    if (!student) {
      return res.status(404).json({ error: { msg: "Student already exists" } });
    }

    return res.status(200).json(student);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// @route  PUT api/admin/students
// @desc   update the details of a student
// @access Private

exports.updateStudent = async (req, res) => {
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
};

// @route  DELELTE api/admin/students
// @desc   delete a student entry
// @access Private

exports.deleteStudent = async (req, res) => {
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
};

// @route  GET api/admin/students
// @desc   get list of all the students
// @access Private

exports.listStudents = async (req, res) => {
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
};

// @route  GET api/admin/students
// @desc   get list of all the students enquiries
// @access Private

exports.listEnquiries = async (req, res) => {
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
};

// @route  GET api/admin/students
// @desc   get list of all the enrolled students
// @access Private

exports.listEnrollments = async (req, res) => {
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
};

// @route  GET api/admin/students
// @desc   get all the enquires of last 30 days
// @access Private

exports.listEnquiriesInThirtyDays = async (req, res) => {
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
};

// @route  GET api/admin/students
// @desc   get all the enquires of last 90 days
// @access Private

exports.listEnquiriesInNinetyDays = async (req, res) => {
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
};

// @route  GET api/admin/students
// @desc   get all the enquires in last year
// @access Private

exports.listEnquiriesInLastYear = async (req, res) => {
  try {
    const currentDate = new Date();
    let oneYearBefore = new Date();
    oneYearBefore = oneYearBefore.setDate(oneYearBefore.getDate() - 365);

    fetchQuery = {
      enquiryDate: { $gte: oneYearBefore, $lte: currentDate },
      enquiryStatus: true,
    };

    const listOfEnquiriesInLastYear = await Student.find(fetchQuery, (err) => {
      if (err || listOfEnquiriesInLastYear === 0) {
        return res.status(404).json(err);
      }
    }).sort({ enquiryDate: -1 });
    return res.status(200).json(listOfEnquiriesInLastYear);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

// @route  GET api/admin/students
// @desc   get all the enrollments of last 30 days
// @access Private

exports.listEnrollmentsInThirtyDays = async (req, res) => {
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
};

// @route  GET api/admin/students
// @desc   get all the enquires of last 90 days
// @access Private

exports.listEnrollmentsInNinetyDays = async (req, res) => {
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
};

// @route  GET api/admin/students
// @desc   get all the enquires in last year
// @access Private

exports.listEnrollmentsInLastYear = async (req, res) => {
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
};

// @route  GET api/admin/students
// @desc   get number of all the students
// @access Private

exports.totalStudents = async (req, res) => {
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
};

// @route  GET api/admin/students
// @desc   get number of all the enquiries
// @access Private

exports.totalEnquiries = async (req, res) => {
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
};

// @route  GET api/admin/students
// @desc   get number of all the enrollments
// @access Private

exports.totalEnrollments = async (req, res) => {
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
};

// @route  GET api/admin/students
// @desc   get all the enquires of last 30 days
// @access Private

exports.totalEnquiriesInThirtyDays = async (req, res) => {
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
};

// @route  GET api/admin/students
// @desc   get all the enquires of last 90 days
// @access Private

exports.totalEnquiriesInNinetyDays = async (req, res) => {
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
};

// @route  POST api/admin/students
// @desc   get all the enquires of year
// @access Private

exports.totalEnquiriesInLastYear = async (req, res) => {
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
};

// @route  GET api/admin/students
// @desc   get all the enrollments in last 30 days
// @access Private

exports.totalEnrollmentsInThirtyDays = async (req, res) => {
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
};

// @route  GET api/admin/students
// @desc   get all the enrollments in last 90 days
// @access Private

exports.totalEnrollmentsInNinetyDays = async (req, res) => {
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
};

// @route  GET api/admin/students
// @desc   get all the enrollments in last one year
// @access Private

exports.totalEnrollmentsInLastYear = async (req, res) => {
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
};
