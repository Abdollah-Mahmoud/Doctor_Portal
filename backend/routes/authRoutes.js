const express = require('express');
const router = express.Router();
const {
  registerDoctor,
  loginDoctor,
  getProfile,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerDoctor);
router.post('/login', loginDoctor);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
