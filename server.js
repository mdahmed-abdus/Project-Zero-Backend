const express = require("express");
const connectDB = require("./config/db");
// const session = require('express-session');
// const { check, validationResult } = require('express-validator');

const app = express();

//Init Middleware
app.use(express.json({ extended: false }));

//Connect Database
connectDB();

app.get("/", (req, res) => res.send("API Running"));

//Define Routes
app.use("/api/sign-up", require("./routes/api/users"));
app.use("/api/", require("./routes/api/auth"));
app.use("api/sign-out", require("./routes/api/auth"));
app.use("/api/admin/", require("./routes/api/students"));
// app.use('/api/logout', require('./routes/api/logout'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
