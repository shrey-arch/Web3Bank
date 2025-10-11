const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// REGISTER
router.post('/register', async (req, res) => {
  const { firstName, lastName, username, email, mobile, password, address } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { firstName, lastName, username, email, mobile, password: hashedPassword, address },
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt body:', req.body);

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    console.log('DB lookup user:', user);

    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('bcrypt compare result:', isMatch);

    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const secret = process.env.JWT_SECRET || 'dev_secret';
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });

    console.log('Issued token (first 40 chars):', token.slice(0, 40) + '...');
    res.json({
       message: 'Login successful',
      token,
      username: user.username,     // ✅ Add this
      firstName: user.firstName,   // optional
      lastName: user.lastName,     // optional
      email: user.email    
      });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
});

module.exports = router;
