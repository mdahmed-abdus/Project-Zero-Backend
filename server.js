const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');
// const session = require('express-session');
// const { check, validationResult } = require('express-validator');

const app = express();

// Middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));

//Connect Database
connectDB();

app.get('/', (req, res) => res.send('API Running'));

//Define Routes
app.use('/api/', require('./routes/api/users'));
app.use('/api/', require('./routes/api/auth'));
app.use('api/sign-out', require('./routes/api/auth'));
app.use('/api/admin/students', require('./routes/api/students'));
app.use('/api/admin/courses', require('./routes/api/courses'));
// app.use('/api/logout', require('./routes/api/logout'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
