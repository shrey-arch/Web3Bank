require('dotenv').config(); // load .env before anything else
const express = require('express');
const { PrismaClient } = require('@prisma/client'); // adjust if needed
const cors = require('cors');
const authRouter = require('./routes/auth'); // 💡 Import routes BEFORE app.listen

const app = express();
const prisma = new PrismaClient();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Use your auth routes
app.use('/auth', authRouter);

// Example route — test connection
app.get('/', (req, res) => {
  res.send('Backend is working ✅');
});

// Example route to get all users (replace 'user' with your actual model name)
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany(); // Replace 'user' if needed
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const authMiddleware = require('./middleware/authMiddleware');

// Example: Protected profile route
app.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, firstName: true, lastName: true, email: true }
    });

    res.json({ message: 'Profile fetched successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});