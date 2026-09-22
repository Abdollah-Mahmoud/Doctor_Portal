import React, { useState, useEffect } from 'react';

const PatientForm = ({ initialData, onSubmit, isSubmitting, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phoneNumber: '',
    gender: 'Male',
    medicalHistory: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        age: initialData.age !== undefined ? initialData.age : '',
        phoneNumber: initialData.phoneNumber || '',
        gender: initialData.gender || 'Male',
        medicalHistory: initialData.medicalHistory || '',
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Patient name is required';
    if (!formData.age || isNaN(formData.age) || Number(formData.age) < 0) {
      newErrors.age = 'Valid age is required';
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="portal-form">
      <div className="row g-3">
        {/* Name */}
        <div className="col-12 col-md-6">
          <label htmlFor="name" className="form-label">
            Patient Full Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        {/* Age */}
        <div className="col-12 col-md-3">
          <label htmlFor="age" className="form-label">
            Age <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            id="age"
            name="age"
            min="0"
            max="130"
            className={`form-control ${errors.age ? 'is-invalid' : ''}`}
            placeholder="e.g. 42"
            value={formData.age}
            onChange={handleChange}
            required
          />
          {errors.age && <div className="invalid-feedback">{errors.age}</div>}
        </div>

        {/* Gender */}
        <div className="col-12 col-md-3">
          <label htmlFor="gender" className="form-label">
            Gender <span className="text-danger">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            className="form-select"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Phone Number */}
        <div className="col-12">
          <label htmlFor="phoneNumber" className="form-label">
            Phone Number <span className="text-danger">*</span>
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
            placeholder="e.g. +1 (555) 000-1122"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            autoComplete="tel"
          />
          {errors.phoneNumber && (
            <div className="invalid-feedback">{errors.phoneNumber}</div>
          )}
        </div>

        {/* Medical History */}
        <div className="col-12">
          <label htmlFor="medicalHistory" className="form-label">
            Medical History
          </label>
          <textarea
            id="medicalHistory"
            name="medicalHistory"
            rows="3"
            className="form-control"
            placeholder="e.g. Hypertension, Penicillin allergy, Type 2 diabetes..."
            value={formData.medicalHistory}
            onChange={handleChange}
          ></textarea>
          <small className="text-muted">
            Known conditions, chronic illnesses, or past surgeries.
          </small>
        </div>

        {/* Notes */}
        <div className="col-12">
          <label htmlFor="notes" className="form-label">
            Notes / Observations
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            className="form-control"
            placeholder="e.g. Patient prefers morning visits; follow-up in 2 weeks..."
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Form Actions */}
        <div className="col-12 d-flex justify-content-end gap-2 mt-4 pt-2 border-top">
          {onCancel && (
            <button
              type="button"
              className="btn btn-outline-secondary px-4"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary px-4 d-inline-flex align-items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm" role="status"></span>
            )}
            <i className="bi bi-check-lg"></i>
            <span>{initialData ? 'Save Changes' : 'Save Patient'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default PatientForm;
