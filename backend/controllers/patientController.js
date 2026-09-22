const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// @desc    Get all patients (with optional search by name or phone number)
// @route   GET /api/patients
// @access  Private
const getPatients = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { doctor: req.doctor._id };

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { phoneNumber: searchRegex },
      ];
    }

    const patients = await Patient.find(query).sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get single patient by ID (with patient's appointments)
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      doctor: req.doctor._id,
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Also fetch any appointments associated with this patient
    const appointments = await Appointment.find({
      doctor: req.doctor._id,
      $or: [{ patient: patient._id }, { patientName: patient.name }],
    }).sort({ date: -1, time: -1 });

    res.json({ patient, appointments });
  } catch (error) {
    console.error('Error getting patient by id:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Create a new patient
// @route   POST /api/patients
// @access  Private
const createPatient = async (req, res) => {
  try {
    const { name, age, phoneNumber, gender, medicalHistory, notes } = req.body;

    if (!name || age === undefined || !phoneNumber || !gender) {
      return res.status(400).json({
        message: 'Name, age, phone number, and gender are required',
      });
    }

    const patient = await Patient.create({
      name,
      age: Number(age),
      phoneNumber,
      gender,
      medicalHistory: medicalHistory || '',
      notes: notes || '',
      doctor: req.doctor._id,
    });

    res.status(201).json(patient);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update a patient
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      doctor: req.doctor._id,
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const { name, age, phoneNumber, gender, medicalHistory, notes } = req.body;

    patient.name = name !== undefined ? name : patient.name;
    patient.age = age !== undefined ? Number(age) : patient.age;
    patient.phoneNumber = phoneNumber !== undefined ? phoneNumber : patient.phoneNumber;
    patient.gender = gender !== undefined ? gender : patient.gender;
    patient.medicalHistory = medicalHistory !== undefined ? medicalHistory : patient.medicalHistory;
    patient.notes = notes !== undefined ? notes : patient.notes;

    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete a patient
// @route   DELETE /api/patients/:id
// @access  Private
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({
      _id: req.params.id,
      doctor: req.doctor._id,
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Optional: remove or detach appointments
    await Appointment.deleteMany({
      patient: patient._id,
      doctor: req.doctor._id,
    });

    res.json({ message: 'Patient removed successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
