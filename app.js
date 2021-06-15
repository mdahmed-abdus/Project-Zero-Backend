const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//mongoose
mongoose.connect('mongodb://localhost/test',{useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log('connected,,'))
.catch((err)=> console.log(err));

//EJS
app.set('view engine','ejs');
app.use(expressEjsLayout);

//BodyParser
app.use(express.urlencoded({extended : false}));

//Routes
app.use('/',require('./routes/index'));
//app.use('/users',require('./routes/users'));

app.listen(3000); 