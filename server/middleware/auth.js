const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Middleware to authenticate a user
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Assumes Bearer token
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Middleware to check if the user is part of the support staff
const isSupportStaff = (req, res, next) => {
  if (req.user && req.user.isSupportStaff) {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized, not a support staff member.' });
  }
};

module.exports = { isAuthenticated, isSupportStaff };
