import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PatientForm from '../components/PatientForm';
import patientService from '../services/patientService';

const AddPatient = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setError('');
    setIsSubmitting(true);
    try {
      const newPatient = await patientService.create(formData);
      navigate(`/patients/${newPatient._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to add patient. Please check the information and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9 col-xl-8">
          {/* Breadcrumb / Back Link */}
          <div className="mb-3">
            <Link to="/patients" className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1">
              <i className="bi bi-arrow-left"></i>
              <span>Back to Patients List</span>
            </Link>
          </div>

          <div className="portal-card p-4 p-md-5">
            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
              <div className="bg-primary-subtle text-primary p-3 rounded-3 fs-4">
                <i className="bi bi-person-plus-fill"></i>
              </div>
              <div>
                <h3 className="fw-bold mb-1 text-dark">Add New Patient</h3>
                <p className="text-muted small mb-0">
                  Enter the patient's personal details, medical history, and clinical notes.
                </p>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-4">
                <i className="bi bi-exclamation-circle-fill flex-shrink-0"></i>
                <div>{error}</div>
              </div>
            )}

            <PatientForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onCancel={() => navigate('/patients')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;
