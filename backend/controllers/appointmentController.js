const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.doctor._id }).sort({
      date: -1,
      time: -1,
    });
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get upcoming appointments
// @route   GET /api/appointments/upcoming
// @access  Private
const getUpcomingAppointments = async (req, res) => {
  try {
    // Current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    const upcoming = await Appointment.find({
      doctor: req.doctor._id,
      date: { $gte: today },
      status: { $ne: 'Cancelled' },
    })
      .sort({ date: 1, time: 1 })
      .limit(10);

    res.json(upcoming);
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const { patientName, patientId, date, time, reason, status } = req.body;

    if (!patientName || !date || !time) {
      return res.status(400).json({
        message: 'Patient name, date, and time are required',
      });
    }

    const appointment = await Appointment.create({
      patientName,
      patient: patientId || null,
      date,
      time,
      reason: reason || '',
      status: status || 'Scheduled',
      doctor: req.doctor._id,
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.doctor._id,
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const { patientName, date, time, reason, status } = req.body;

    appointment.patientName = patientName !== undefined ? patientName : appointment.patientName;
    appointment.date = date !== undefined ? date : appointment.date;
    appointment.time = time !== undefined ? time : appointment.time;
    appointment.reason = reason !== undefined ? reason : appointment.reason;
    appointment.status = status !== undefined ? status : appointment.status;

    const updated = await appointment.save();
    res.json(updated);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      doctor: req.doctor._id,
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment removed', id: req.params.id });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get dashboard metrics / stats
// @route   GET /api/appointments/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const totalPatients = await Patient.countDocuments({ doctor: req.doctor._id });
    const totalAppointments = await Appointment.countDocuments({ doctor: req.doctor._id });
    const todayAppointments = await Appointment.countDocuments({
      doctor: req.doctor._id,
      date: today,
    });
    const upcomingAppointments = await Appointment.countDocuments({
      doctor: req.doctor._id,
      date: { $gte: today },
      status: 'Scheduled',
    });

    res.json({
      totalPatients,
      totalAppointments,
      todayAppointments,
      upcomingAppointments,
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  getAppointments,
  getUpcomingAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getDashboardStats,
};
