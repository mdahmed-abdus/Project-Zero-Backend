const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth");
const {
  createStudent,
  createEnquiry,
  createEnrollment,
  enquiryToEnrollement,
  findStudent,
  updateStudent,
  deleteStudent,
  listStudents,
  listEnquiries,
  listEnrollments,
  listEnquiriesInThirtyDays,
  listEnquiriesInNinetyDays,
  listEnquiriesInLastYear,
  listEnrollmentsInThirtyDays,
  listEnrollmentsInNinetyDays,
  listEnrollmentsInLastYear,
  totalStudents,
  totalEnquiries,
  totalEnrollments,
  totalEnquiriesInThirtyDays,
  totalEnquiriesInNinetyDays,
  totalEnquiriesInLastYear,
  totalEnrollmentsInThirtyDays,
  totalEnrollmentsInNinetyDays,
  totalEnrollmentsInLastYear,
} = require("../../controllers/studentController");
const Student = require("../../Models/student");

router.post("/create-student", verifyToken, createStudent);
router.post("/create-enquiry", verifyToken, createEnquiry);
router.post("/create-enrollment", verifyToken, createEnrollment);
router.put("/enquiry-to-enrollment/:id", verifyToken, enquiryToEnrollement);
router.get("/find-student/:phoneNumber", verifyToken, findStudent);
router.put("/update-student/:phoneNumber", verifyToken, updateStudent);
router.delete("/delete-student/:phoneNumber", verifyToken, deleteStudent);
router.get("/list-students", verifyToken, listStudents);
router.get("/list-all-enquiries", verifyToken, listEnquiries);
router.get("/list-all-enrollments", verifyToken, listEnrollments);
router.get(
  "/list-all-enquiries-in-last-30-days",
  verifyToken,
  listEnquiriesInThirtyDays
);
router.get(
  "/list-all-enquiries-in-last-90-days",
  verifyToken,
  listEnquiriesInNinetyDays
);
router.get(
  "/list-all-enquiries-in-last-year",
  verifyToken,
  listEnquiriesInLastYear
);
router.get(
  "/list-all-enrollments-in-last-30-days",
  verifyToken,
  listEnrollmentsInThirtyDays
);
router.get(
  "/list-all-enrollments-in-last-90-days",
  verifyToken,
  listEnrollmentsInNinetyDays
);
router.get(
  "/list-all-enrollments-in-last-year",
  verifyToken,
  listEnrollmentsInLastYear
);
router.get("/number-of-students", verifyToken, totalStudents);
router.get("/number-of-enquiries", verifyToken, totalEnquiries);
router.get("/number-of-enrollments", verifyToken, totalEnrollments);
router.get(
  "/number-of-enquiries-in-last-30-days",
  verifyToken,
  totalEnquiriesInThirtyDays
);
router.get(
  "/number-of-enquiries-in-last-90-days",
  verifyToken,
  totalEnquiriesInNinetyDays
);
router.get(
  "/number-of-enquiries-in-last-year",
  verifyToken,
  totalEnquiriesInLastYear
);
router.get(
  "/number-of-enrollments-in-last-30-days",
  verifyToken,
  totalEnrollmentsInThirtyDays
);
router.get(
  "/number-of-enrollments-in-last-90-days",
  verifyToken,
  totalEnrollmentsInNinetyDays
);
router.get(
  "/number-of-enrollments-in-last-year",
  verifyToken,
  totalEnrollmentsInLastYear
);

module.exports = router;
