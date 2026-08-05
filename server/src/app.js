const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const menuRoutes = require('./routes/menuRoutes');
const userTypeRoutes = require('./routes/userTypeRoutes');
const rolePermissionRoutes = require('./routes/rolePermissionRoutes');
const expertiesRoutes = require('./routes/expertiesRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/user-types', userTypeRoutes);
app.use('/api/permissions', rolePermissionRoutes);
app.use('/api/experties', expertiesRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

module.exports = app;
