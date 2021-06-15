const express = require('express');
const connectDB = require('./config/db');
const session = require('express-session');
const { check, validationResult } = require('express-validator');

const app = express();

//Init Middleware
app.use(express.json({ extended:false }))

//Connect Database
connectDB();

app.get('/', (req, res) => res.send('API Running'));

//Define Routes
app.use('/api/admin/sign-up', require('./routes/api/admin'));
app.use('/api/admin/sign-in', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/logout', require('./routes/api/logout'));


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));