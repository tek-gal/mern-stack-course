const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const config = require('config');

const router = Router();

// api/auth
router.post(
  '/register',
  [
    check('email', 'Incorrect email ').isEmail(),
    check('password', 'Minimal password length is 6').isLength({ min: 6 }),
  ]
  ,
  async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Incorrect registration data',
      });
    }

    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      return res.status(400).json({ message: 'This email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword });

    await user.save();

    res.status(201).json({ message: 'The user has been created' });

  } catch (e) {
    res.status(500).json({
      message: 'Something went wrong. Please, try again...',
    });
  }
});

// api/auth
router.post(
  '/login',
  [
    check('email', 'Type correct email').normalizeEmail().isEmail(),
    check('password', 'Type password').exists(),
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Incorrect sign-in data',
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'No such user' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password. Try again' });
    }

    const token = jwt.sign(
      { userId: user.id },
      config.get('jwtSecret'),
      { expiresIn: '1h' },
    );

    res.json({ token, userId: user.id });

  } catch (e) {
    res.status(500).json({
      message: 'Something went wrong. Please, try again...',
    });
  }
});

module.exports = router;
