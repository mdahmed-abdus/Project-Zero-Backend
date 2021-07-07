const fs = require("fs");
const _ = require("lodash");
const formidable = require("formidable");
const Course = require("../Models/course");

// @route POST api/admin/courses
// @desc Create a course description
// @access Private

exports.createCourse = async (req, res) => {
  // Basic Setup
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  // Form Parsing
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log("Error parsing the files");
      return res.status(400).json({
        status: "Fail",
        message: "There was an error parsing the files",
        error: err,
      });
    }

    const { name, authorName, fees, numberOfLectures, duration, rating } =
      fields;

    if (
      !name ||
      !authorName ||
      !fees ||
      !numberOfLectures ||
      !duration ||
      !rating
    ) {
      return res.status(400).json({
        err: "All fields are required - name, authorName, fees, numberOfLectures, duration, rating",
      });
    }

    try {
      let courseName = await Course.findOne({ name });
      if (courseName) {
        return res
          .status(400)
          .json({ message: "Entered course already exists" });
      }
      let course = new Course(fields);

      if (files.photo) {
        // console.log("PHOTO", files.photo);
        if (files.photo.size > 10 * 1024 * 1024) {
          return res.status(400).json({
            error: "Image size should be less then 1 MB",
          });
        }

        course.photo.data = fs.readFileSync(files.photo.path);
        course.photo.contentType = files.photo.type;
      }

      await course.save();
      return res.status(200).json({ course });
    } catch (err) {
      return res.status(500).json({ err: "Server error" });
    }
  });
};

// @route GET api/admin/courses
// @desc list all the courses
// @access Private

exports.listCourses = async (req, res) => {
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
};

// @route UPDATE api/admin/courses
// @desc update the details of a course
// @access Private

exports.updateCourse = async (req, res) => {
    // Basic Setup
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    // Form Parsing
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log("Error parsing the files");
        return res.status(400).json({
          status: "Fail",
          message: "There was an error parsing the files",
          error: err,
        });
      }
  
      const { name, authorName, fees, numberOfLectures, duration, rating } =
        fields;
  
      if (
        !name ||
        !authorName ||
        !fees ||
        !numberOfLectures ||
        !duration ||
        !rating
      ) {
        return res.status(400).json({
          err: "All fields are required - name, authorName, fees, numberOfLectures, duration, rating",
        });
      }
  
      try {
        let course = req.course;
        course = _.extend(course, fields);
  
        if (files.photo) {
          // console.log("PHOTO", files.photo);
          if (files.photo.size > 10 * 1024 * 1024) {
            return res.status(400).json({
              error: "Image size should be less then 1 MB",
            });
          }
  
          course.photo.data = fs.readFileSync(files.photo.path);
          course.photo.contentType = files.photo.type;
        }
  
        await course.save();
        return res.status(200).json(course);
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    });
  };

// @route DELETE api/admin/courses
// @desc delete a course
// @access Private

exports.deleteCourse = async (req, res) => {
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
};


