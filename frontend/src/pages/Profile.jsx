import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const Profile = () => {
  const { doctor, updateDoctorState } = useAuth();

  const [formData, setFormData] = useState({
    name: doctor?.name || '',
    email: doctor?.email || '',
    phoneNumber: doctor?.phoneNumber || '',
    specialty: doctor?.specialty || '',
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [alert, setAlert] = useState(null);

  const specialties = [
    'General Practitioner / Family Medicine',
    'Internal Medicine & Cardiology',
    'Pediatrics',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Gynecology & Obstetrics',
    'Psychiatry',
    'Ophthalmology',
    'Dentistry',
    'Other Specialty',
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (alert) setAlert(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setAlert(null);

    try {
      const updated = await authService.updateProfile({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        specialty: formData.specialty,
      });

      updateDoctorState(updated);
      setAlert({
        type: 'success',
        message: 'Doctor profile updated successfully.',
      });
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-7">
          {/* Header */}
          <div className="mb-4">
            <h2 className="fw-bold mb-1 text-dark">Doctor Profile & Practice Settings</h2>
            <p className="text-muted mb-0">
              Manage your personal credentials, contact details, and clinical specialty.
            </p>
          </div>

          {alert && (
            <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
              {alert.message}
              <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
            </div>
          )}

          {/* Profile Card */}
          <div className="portal-card p-4 p-md-5 mb-4">
            <div className="d-flex align-items-center gap-3 pb-4 mb-4 border-bottom">
              <div
                className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center shadow-sm"
                style={{ width: '64px', height: '64px', fontSize: '1.75rem' }}
              >
                <i className="bi bi-person-fill"></i>
              </div>
              <div>
                <h4 className="fw-bold mb-0 text-dark">{doctor?.name}</h4>
                <div className="badge bg-primary-subtle text-primary mt-1">
                  {doctor?.specialty}
                </div>
                <div className="small text-muted mt-1">{doctor?.email}</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="portal-form">
              <div className="row g-3">
                {/* Doctor Name */}
                <div className="col-12">
                  <label htmlFor="name">Doctor Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email (Read-only for security) */}
                <div className="col-12 col-md-6">
                  <label htmlFor="email">Email Address (Login ID)</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control bg-light"
                    value={formData.email}
                    disabled
                  />
                  <small className="text-muted">Email cannot be changed.</small>
                </div>

                {/* Phone Number */}
                <div className="col-12 col-md-6">
                  <label htmlFor="phoneNumber">Contact Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    className="form-control"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Specialty */}
                <div className="col-12">
                  <label htmlFor="specialty">Doctor Specialty / Category</label>
                  <select
                    id="specialty"
                    name="specialty"
                    className="form-select"
                    value={formData.specialty}
                    onChange={handleChange}
                    required
                  >
                    {specialties.map((spec, i) => (
                      <option key={i} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Save button */}
                <div className="col-12 pt-3 border-top d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-primary px-4 d-inline-flex align-items-center gap-2"
                    disabled={isUpdating}
                  >
                    {isUpdating && (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    )}
                    <i className="bi bi-check-circle"></i>
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Security & System Info */}
          <div className="portal-card p-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-shield-check text-success"></i>
              <span>System & Privacy Security</span>
            </h5>
            <div className="text-muted small">
              <p className="mb-2">
                <i className="bi bi-check2 text-success me-2"></i>
                All patient health records and medical notes are protected under doctor confidentiality rules.
              </p>
              <p className="mb-0">
                <i className="bi bi-check2 text-success me-2"></i>
                Session protected via encrypted JWT tokens and hashed credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
