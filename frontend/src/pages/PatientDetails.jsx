import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import patientService from '../services/patientService';
import appointmentService from '../services/appointmentService';
import PatientForm from '../components/PatientForm';
import AppointmentTable from '../components/AppointmentTable';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [alert, setAlert] = useState(null);

  const loadPatientData = async () => {
    try {
      setLoading(true);
      const data = await patientService.getById(id);
      setPatient(data.patient);
      setAppointments(data.appointments || []);
    } catch (err) {
      setAlert({
        type: 'danger',
        message: 'Could not load patient details. Patient may not exist.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatientData();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      setIsUpdating(true);
      const updated = await patientService.update(id, formData);
      setPatient(updated);
      setIsEditing(false);
      setAlert({
        type: 'success',
        message: 'Patient profile updated successfully.',
      });
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to update patient.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete patient "${patient.name}"? This action cannot be undone.`
      )
    ) {
      try {
        await patientService.delete(id);
        navigate('/patients');
      } catch (err) {
        setAlert({
          type: 'danger',
          message: 'Failed to delete patient.',
        });
      }
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await appointmentService.update(appointmentId, { status: newStatus });
      setAlert({
        type: 'info',
        message: `Appointment updated to ${newStatus}.`,
      });
      loadPatientData();
    } catch (err) {
      setAlert({
        type: 'danger',
        message: 'Failed to update appointment.',
      });
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm('Delete this appointment record?')) {
      try {
        await appointmentService.delete(appointmentId);
        setAlert({
          type: 'success',
          message: 'Appointment deleted.',
        });
        loadPatientData();
      } catch (err) {
        setAlert({
          type: 'danger',
          message: 'Failed to delete appointment.',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading patient profile...</span>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container py-5 text-center">
        <h4>Patient Not Found</h4>
        <Link to="/patients" className="btn btn-primary mt-3">
          Back to Patients List
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Top back navigation */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <Link
          to="/patients"
          className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1"
        >
          <i className="bi bi-arrow-left"></i>
          <span>Back to Patients List</span>
        </Link>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
        </div>
      )}

      {/* Main Patient Card */}
      <div className="portal-card p-4 p-md-5 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 pb-3 mb-4 border-bottom">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle bg-primary-subtle text-primary fw-bold d-flex align-items-center justify-content-center border"
              style={{ width: '64px', height: '64px', fontSize: '1.75rem' }}
            >
              {patient.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="fw-bold mb-1 text-dark">{patient.name}</h3>
              <div className="d-flex flex-wrap gap-2 text-muted small">
                <span>
                  <i className="bi bi-calendar3 me-1"></i>
                  {patient.age} years old
                </span>
                <span>•</span>
                <span>
                  <i className="bi bi-gender-ambiguous me-1"></i>
                  {patient.gender}
                </span>
                <span>•</span>
                <span>
                  <i className="bi bi-telephone me-1"></i>
                  {patient.phoneNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={() => setIsEditing(!isEditing)}
            >
              <i className={`bi ${isEditing ? 'bi-x-lg' : 'bi-pencil'}`}></i>
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
            <button
              type="button"
              className="btn btn-outline-danger d-flex align-items-center gap-2"
              onClick={handleDelete}
            >
              <i className="bi bi-trash"></i>
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Edit Form or Patient Detail View */}
        {isEditing ? (
          <div>
            <h5 className="fw-bold mb-3 text-primary">Edit Patient Information</h5>
            <PatientForm
              initialData={patient}
              onSubmit={handleUpdate}
              isSubmitting={isUpdating}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="p-3 bg-light rounded-3 h-100 border">
                <div className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                  <i className="bi bi-file-earmark-medical text-primary"></i>
                  <span>Medical History</span>
                </div>
                <p className="mb-0 text-secondary" style={{ whiteSpace: 'pre-line' }}>
                  {patient.medicalHistory || 'No medical history recorded for this patient.'}
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="p-3 bg-light rounded-3 h-100 border">
                <div className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                  <i className="bi bi-journal-text text-primary"></i>
                  <span>Doctor Clinical Notes</span>
                </div>
                <p className="mb-0 text-secondary" style={{ whiteSpace: 'pre-line' }}>
                  {patient.notes || 'No clinical notes added yet.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Patient Appointments Section */}
      <div className="portal-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-1">
              <i className="bi bi-calendar-week text-primary me-2"></i>
              Appointment History
            </h5>
            <small className="text-muted">
              Scheduled and completed visits for {patient.name}
            </small>
          </div>
          <Link
            to="/appointments/add"
            className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"
          >
            <i className="bi bi-plus-lg"></i>
            <span>Schedule Appointment</span>
          </Link>
        </div>

        <AppointmentTable
          appointments={appointments}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteAppointment}
        />
      </div>
    </div>
  );
};

export default PatientDetails;
