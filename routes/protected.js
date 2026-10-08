const express = require('express');
const User = require('../models/User');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select('_id name email createdAt');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Protected route accessed successfully.',
      user
    });
  } catch (error) {
    console.error('Protected route error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
