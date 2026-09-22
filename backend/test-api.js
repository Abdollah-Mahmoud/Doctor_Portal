const http = require('http');

// Helper to make HTTP requests
const request = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('=== Starting Doctor Portal API Automated Tests ===\n');
  const timestamp = Date.now();

  // Test 1: Health check
  try {
    const health = await request({
      hostname: 'localhost',
      port: 5050,
      path: '/api/health',
      method: 'GET',
    });
    console.log(`[PASS] Health Check status: ${health.status} (${health.data.message})`);
  } catch (err) {
    console.error('[FAIL] Health Check failed:', err.message);
    process.exit(1);
  }

  // Test 2: Register a new test doctor
  let token = '';
  const testDoctorEmail = `doctor.test.${timestamp}@clinic.com`;
  try {
    const regRes = await request(
      {
        hostname: 'localhost',
        port: 5050,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Dr. Test Physician',
        email: testDoctorEmail,
        phoneNumber: '+1 (555) 999-8877',
        specialty: 'Internal Medicine & Cardiology',
        password: 'password123',
      }
    );
    if (regRes.status === 201 && regRes.data.token) {
      token = regRes.data.token;
      console.log(`[PASS] Doctor Registration: ${regRes.data.doctor.email}`);
    } else {
      throw new Error(`Status ${regRes.status}: ${JSON.stringify(regRes.data)}`);
    }
  } catch (err) {
    console.error('[FAIL] Doctor registration failed:', err.message);
    process.exit(1);
  }

  // Test 3: Login test
  try {
    const loginRes = await request(
      {
        hostname: 'localhost',
        port: 5050,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        email: testDoctorEmail,
        password: 'password123',
      }
    );
    if (loginRes.status === 200 && loginRes.data.token) {
      console.log(`[PASS] Doctor Login successful`);
    } else {
      throw new Error(`Status ${loginRes.status}: ${JSON.stringify(loginRes.data)}`);
    }
  } catch (err) {
    console.error('[FAIL] Doctor login failed:', err.message);
    process.exit(1);
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // Test 4: Get and update Doctor Profile
  try {
    const profRes = await request({
      hostname: 'localhost',
      port: 5050,
      path: '/api/auth/profile',
      method: 'GET',
      headers: authHeaders,
    });
    if (profRes.status === 200 && profRes.data.name === 'Dr. Test Physician') {
      console.log(`[PASS] Get Profile: ${profRes.data.name}`);
    } else {
      throw new Error(`Status ${profRes.status}`);
    }

    const updateProfRes = await request(
      {
        hostname: 'localhost',
        port: 5050,
        path: '/api/auth/profile',
        method: 'PUT',
        headers: authHeaders,
      },
      {
        name: 'Dr. Test Physician, MD, FACC',
        phoneNumber: '+1 (555) 000-9999',
        specialty: 'Internal Medicine & Cardiology',
      }
    );
    if (updateProfRes.status === 200 && updateProfRes.data.name.includes('FACC')) {
      console.log(`[PASS] Update Profile: ${updateProfRes.data.name}`);
    } else {
      throw new Error(`Status ${updateProfRes.status}`);
    }
  } catch (err) {
    console.error('[FAIL] Profile test failed:', err.message);
    process.exit(1);
  }

  // Test 5: Patient CRUD & Search
  let patientId = '';
  try {
    // 5a: Create Patient
    const createPatRes = await request(
      {
        hostname: 'localhost',
        port: 5050,
        path: '/api/patients',
        method: 'POST',
        headers: authHeaders,
      },
      {
        name: 'Alice Wonder',
        age: 34,
        phoneNumber: '+1 (555) 777-6655',
        gender: 'Female',
        medicalHistory: 'Asthma, Penicillin Allergy',
        notes: 'Requested telephone reminders before visits.',
      }
    );
    if (createPatRes.status === 201 && createPatRes.data._id) {
      patientId = createPatRes.data._id;
      console.log(`[PASS] Create Patient: ${createPatRes.data.name} (ID: ${patientId})`);
    } else {
      throw new Error(`Status ${createPatRes.status}: ${JSON.stringify(createPatRes.data)}`);
    }

    // 5b: Search patient by name
    const searchNameRes = await request({
      hostname: 'localhost',
      port: 5050,
      path: '/api/patients?search=Alice',
      method: 'GET',
      headers: authHeaders,
    });
    if (searchNameRes.status === 200 && searchNameRes.data.length >= 1) {
      console.log(`[PASS] Search Patient by Name ("Alice"): Found ${searchNameRes.data.length}`);
    } else {
      throw new Error(`Status ${searchNameRes.status}`);
    }

    // 5c: Search patient by phone number
    const searchPhoneRes = await request({
      hostname: 'localhost',
      port: 5050,
      path: '/api/patients?search=777-6655',
      method: 'GET',
      headers: authHeaders,
    });
    if (searchPhoneRes.status === 200 && searchPhoneRes.data.length >= 1) {
      console.log(`[PASS] Search Patient by Phone ("777-6655"): Found ${searchPhoneRes.data.length}`);
    } else {
      throw new Error(`Status ${searchPhoneRes.status}`);
    }

    // 5d: Get Patient by ID
    const getByIdRes = await request({
      hostname: 'localhost',
      port: 5050,
      path: `/api/patients/${patientId}`,
      method: 'GET',
      headers: authHeaders,
    });
    if (getByIdRes.status === 200 && getByIdRes.data.patient.name === 'Alice Wonder') {
      console.log(`[PASS] Get Patient by ID: ${getByIdRes.data.patient.name}`);
    } else {
      throw new Error(`Status ${getByIdRes.status}`);
    }

    // 5e: Update Patient
    const updatePatRes = await request(
      {
        hostname: 'localhost',
        port: 5050,
        path: `/api/patients/${patientId}`,
        method: 'PUT',
        headers: authHeaders,
      },
      {
        notes: 'Updated notes: Inhaler dosage adjusted.',
      }
    );
    if (updatePatRes.status === 200 && updatePatRes.data.notes.includes('dosage adjusted')) {
      console.log(`[PASS] Update Patient Notes: ${updatePatRes.data.notes}`);
    } else {
      throw new Error(`Status ${updatePatRes.status}`);
    }
  } catch (err) {
    console.error('[FAIL] Patient CRUD test failed:', err.message);
    process.exit(1);
  }

  // Test 6: Appointment CRUD & Upcoming & Stats
  let apptId = '';
  try {
    // 6a: Create Appointment
    const createDate = new Date();
    createDate.setDate(createDate.getDate() + 2);
    const dateStr = createDate.toISOString().split('T')[0];

    const createApptRes = await request(
      {
        hostname: 'localhost',
        port: 5050,
        path: '/api/appointments',
        method: 'POST',
        headers: authHeaders,
      },
      {
        patientName: 'Alice Wonder',
        patientId: patientId,
        date: dateStr,
        time: '11:15 AM',
        reason: 'Spirometry test follow-up',
        status: 'Scheduled',
      }
    );
    if (createApptRes.status === 201 && createApptRes.data._id) {
      apptId = createApptRes.data._id;
      console.log(`[PASS] Create Appointment: ${createApptRes.data.patientName} on ${createApptRes.data.date}`);
    } else {
      throw new Error(`Status ${createApptRes.status}`);
    }

    // 6b: Get Upcoming Appointments
    const upcomingRes = await request({
      hostname: 'localhost',
      port: 5050,
      path: '/api/appointments/upcoming',
      method: 'GET',
      headers: authHeaders,
    });
    if (upcomingRes.status === 200 && upcomingRes.data.length >= 1) {
      console.log(`[PASS] Get Upcoming Appointments: ${upcomingRes.data.length} found`);
    } else {
      throw new Error(`Status ${upcomingRes.status}`);
    }

    // 6c: Get Dashboard Stats
    const statsRes = await request({
      hostname: 'localhost',
      port: 5050,
      path: '/api/appointments/stats',
      method: 'GET',
      headers: authHeaders,
    });
    if (statsRes.status === 200 && statsRes.data.totalPatients >= 1) {
      console.log(`[PASS] Get Dashboard Stats: Patients=${statsRes.data.totalPatients}, Upcoming=${statsRes.data.upcomingAppointments}`);
    } else {
      throw new Error(`Status ${statsRes.status}`);
    }

    // 6d: Update Appointment Status
    const updateApptRes = await request(
      {
        hostname: 'localhost',
        port: 5050,
        path: `/api/appointments/${apptId}`,
        method: 'PUT',
        headers: authHeaders,
      },
      {
        status: 'Completed',
      }
    );
    if (updateApptRes.status === 200 && updateApptRes.data.status === 'Completed') {
      console.log(`[PASS] Update Appointment Status to "Completed"`);
    } else {
      throw new Error(`Status ${updateApptRes.status}`);
    }

    // 6e: Delete Appointment
    const delApptRes = await request({
      hostname: 'localhost',
      port: 5050,
      path: `/api/appointments/${apptId}`,
      method: 'DELETE',
      headers: authHeaders,
    });
    if (delApptRes.status === 200) {
      console.log(`[PASS] Delete Appointment`);
    } else {
      throw new Error(`Status ${delApptRes.status}`);
    }

    // 5f: Delete Patient
    const delPatRes = await request({
      hostname: 'localhost',
      port: 5050,
      path: `/api/patients/${patientId}`,
      method: 'DELETE',
      headers: authHeaders,
    });
    if (delPatRes.status === 200) {
      console.log(`[PASS] Delete Patient`);
    } else {
      throw new Error(`Status ${delPatRes.status}`);
    }
  } catch (err) {
    console.error('[FAIL] Appointment / cleanup test failed:', err.message);
    process.exit(1);
  }

  console.log('\n=== ALL API TESTS PASSED SUCCESSFULLY! ===');
};

runTests();
