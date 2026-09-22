const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor_portal'
    );
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Doctor.deleteMany();
    await Patient.deleteMany();
    await Appointment.deleteMany();
    console.log('Cleared existing collections.');

    // Create Dummy Doctor
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const doctor = await Doctor.create({
      name: 'Dr. Sarah Jenkins, MD',
      email: 'dr.sarah@clinic.com',
      phoneNumber: '+1 (555) 234-5678',
      specialty: 'Internal Medicine & Cardiology',
      password: hashedPassword,
    });
    console.log(`Created dummy doctor: ${doctor.email} / password123`);

    // Helper for upcoming dates
    const getFormattedDate = (daysFromNow) => {
      const d = new Date();
      d.setDate(d.getDate() + daysFromNow);
      return d.toISOString().split('T')[0];
    };

    // Create Dummy Patients
    const dummyPatients = [
      {
        name: 'Michael Brown',
        age: 45,
        phoneNumber: '+1 (555) 345-6789',
        gender: 'Male',
        medicalHistory: 'Mild Hypertension, Penicillin Allergy',
        notes: 'Prefers morning appointments. Follow-up blood pressure check.',
        doctor: doctor._id,
      },
      {
        name: 'Emily Davis',
        age: 32,
        phoneNumber: '+1 (555) 456-7890',
        gender: 'Female',
        medicalHistory: 'Type 2 Diabetes (controlled), Seasonal Allergies',
        notes: 'Review HbA1c lab results and updated dietary lifestyle plan.',
        doctor: doctor._id,
      },
      {
        name: 'Robert Wilson',
        age: 58,
        phoneNumber: '+1 (555) 567-8901',
        gender: 'Male',
        medicalHistory: 'Asthma, High Cholesterol',
        notes: 'Uses Albuterol inhaler as needed. Annual cardiac screening scheduled.',
        doctor: doctor._id,
      },
      {
        name: 'Sophia Martinez',
        age: 27,
        phoneNumber: '+1 (555) 678-9012',
        gender: 'Female',
        medicalHistory: 'Migraines with aura',
        notes: 'Prescribed Sumatriptan. Monitoring headache frequency diary.',
        doctor: doctor._id,
      },
      {
        name: 'James Anderson',
        age: 64,
        phoneNumber: '+1 (555) 789-0123',
        gender: 'Male',
        medicalHistory: 'Osteoarthritis in right knee, GERD',
        notes: 'Taking Omeprazole daily. Physical therapy evaluation recommended.',
        doctor: doctor._id,
      },
      {
        name: 'Olivia Taylor',
        age: 39,
        phoneNumber: '+1 (555) 890-1234',
        gender: 'Female',
        medicalHistory: 'None reported',
        notes: 'Routine comprehensive annual wellness physical examination.',
        doctor: doctor._id,
      },
    ];

    const createdPatients = await Patient.insertMany(dummyPatients);
    console.log(`Inserted ${createdPatients.length} dummy patients.`);

    // Create Dummy Appointments
    const dummyAppointments = [
      {
        patientName: createdPatients[0].name,
        patient: createdPatients[0]._id,
        date: getFormattedDate(0), // Today
        time: '09:30 AM',
        reason: 'Follow-up blood pressure check and prescription refill',
        status: 'Scheduled',
        doctor: doctor._id,
      },
      {
        patientName: createdPatients[1].name,
        patient: createdPatients[1]._id,
        date: getFormattedDate(1), // Tomorrow
        time: '11:00 AM',
        reason: 'Review 3-month HbA1c lab results and diet consultation',
        status: 'Scheduled',
        doctor: doctor._id,
      },
      {
        patientName: createdPatients[2].name,
        patient: createdPatients[2]._id,
        date: getFormattedDate(2),
        time: '02:15 PM',
        reason: 'Asthma symptom evaluation and spirometry check',
        status: 'Scheduled',
        doctor: doctor._id,
      },
      {
        patientName: createdPatients[3].name,
        patient: createdPatients[3]._id,
        date: getFormattedDate(3),
        time: '10:00 AM',
        reason: 'Migraine frequency assessment and medication adjustment',
        status: 'Scheduled',
        doctor: doctor._id,
      },
      {
        patientName: createdPatients[4].name,
        patient: createdPatients[4]._id,
        date: getFormattedDate(5),
        time: '03:30 PM',
        reason: 'Knee joint pain consultation and imaging review',
        status: 'Scheduled',
        doctor: doctor._id,
      },
      {
        patientName: createdPatients[5].name,
        patient: createdPatients[5]._id,
        date: getFormattedDate(-3), // Past completed
        time: '08:30 AM',
        reason: 'Annual preventive physical exam',
        status: 'Completed',
        doctor: doctor._id,
      },
    ];

    const createdAppointments = await Appointment.insertMany(dummyAppointments);
    console.log(`Inserted ${createdAppointments.length} dummy appointments.`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
