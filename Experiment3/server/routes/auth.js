const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/authenticateToken');

const router = express.Router();

// In-memory user store for this educational experiment.
// Replace with a database layer later if needed.
const users = [];

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const trimmedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!trimmedName || !normalizedEmail || password.length < 6) {
    return res.status(400).json({ message: 'Please provide valid input. Password must be at least 6 characters long.' });
  }

  const emailExists = users.some((user) => user.email === normalizedEmail);

  if (emailExists) {
    return res.status(409).json({ message: 'A user with this email already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now().toString(),
    name: trimmedName,
    email: normalizedEmail,
    password: hashedPassword,
  };

  users.push(user);

  return res.status(201).json({
    message: 'Registration successful. Please log in.',
    user: sanitizeUser(user),
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((record) => record.email === normalizedEmail);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = generateToken(user);

  return res.status(200).json({
    message: 'Login successful.',
    token,
    user: sanitizeUser(user),
  });
});

router.get('/me', authenticateToken, (req, res) => {
  res.status(200).json({
    user: {
      id: req.user.userId,
      email: req.user.email,
      name: req.user.name,
    },
  });
});

module.exports = router;
