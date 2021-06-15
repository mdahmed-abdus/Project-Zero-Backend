const express = require('express');
const router = express.Router();

// login page
router.get('/', (req, res) => {
    res.render('Welcome');
});

// sign-up page
router.get('/sign-up', (req, res) => {
    res.render('register');
});

module.exports = router;