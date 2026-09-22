const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'doctor_portal_super_secret_jwt_key_2026',
    { expiresIn: '7d' }
  );
};

// @desc    Register a new Doctor
// @route   POST /api/auth/register
// @access  Public
const registerDoctor = async (req, res) => {
  try {
    const { name, email, phoneNumber, specialty, password } = req.body;

    if (!name || !email || !phoneNumber || !specialty || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const doctorExists = await Doctor.findOne({ email: email.toLowerCase() });
    if (doctorExists) {
      return res.status(400).json({ message: 'A doctor with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const doctor = await Doctor.create({
      name,
      email: email.toLowerCase(),
      phoneNumber,
      specialty,
      password: hashedPassword,
    });

    if (doctor) {
      res.status(201).json({
        token: generateToken(doctor._id),
        doctor: {
          _id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          phoneNumber: doctor.phoneNumber,
          specialty: doctor.specialty,
        },
      });
    } else {
      res.status(400).json({ message: 'Invalid doctor data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Authenticate Doctor & get token
// @route   POST /api/auth/login
// @access  Public
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const doctor = await Doctor.findOne({ email: email.toLowerCase() });

    if (doctor && (await bcrypt.compare(password, doctor.password))) {
      res.json({
        token: generateToken(doctor._id),
        doctor: {
          _id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          phoneNumber: doctor.phoneNumber,
          specialty: doctor.specialty,
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get logged in doctor profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id).select('-password');
    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.name = req.body.name || doctor.name;
    doctor.phoneNumber = req.body.phoneNumber || doctor.phoneNumber;
    doctor.specialty = req.body.specialty || doctor.specialty;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      doctor.password = await bcrypt.hash(req.body.password, salt);
    }

    const updated = await doctor.save();

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phoneNumber: updated.phoneNumber,
      specialty: updated.specialty,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  registerDoctor,
  loginDoctor,
  getProfile,
  updateProfile,
};
