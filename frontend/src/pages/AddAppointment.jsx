import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AppointmentForm from '../components/AppointmentForm';
import appointmentService from '../services/appointmentService';
import patientService from '../services/patientService';

const AddAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [patientsList, setPatientsList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Check if patient info was passed through route state
  const preselectedPatient = location.state?.patient;

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const list = await patientService.getAll();
        setPatientsList(list);
      } catch (err) {
        console.error('Could not load patients list for dropdown:', err);
      }
    };
    fetchPatients();
  }, []);

  const handleSubmit = async (formData) => {
    setError('');
    setIsSubmitting(true);
    try {
      await appointmentService.create(formData);
      navigate('/appointments');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to create appointment. Please check the details.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const initialData = preselectedPatient
    ? {
        patientName: preselectedPatient.name,
        patientId: preselectedPatient._id,
      }
    : null;

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-7">
          <div className="mb-3">
            <Link
              to="/appointments"
              className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1"
            >
              <i className="bi bi-arrow-left"></i>
              <span>Back to Appointments</span>
            </Link>
          </div>

          <div className="portal-card p-4 p-md-5">
            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
              <div className="bg-info-subtle text-info p-3 rounded-3 fs-4">
                <i className="bi bi-calendar-plus"></i>
              </div>
              <div>
                <h3 className="fw-bold mb-1 text-dark">Schedule Appointment</h3>
                <p className="text-muted small mb-0">
                  Book a consultation slot for an existing or new patient.
                </p>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-4">
                <i className="bi bi-exclamation-circle-fill flex-shrink-0"></i>
                <div>{error}</div>
              </div>
            )}

            <AppointmentForm
              initialData={initialData}
              patientsList={patientsList}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onCancel={() => navigate('/appointments')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAppointment;
