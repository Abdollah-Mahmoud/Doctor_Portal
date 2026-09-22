import React, { useState, useEffect } from 'react';

const AppointmentForm = ({
  initialData,
  patientsList = [],
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    reason: '',
    status: 'Scheduled',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        patientName: initialData.patientName || '',
        patientId: initialData.patient || initialData.patientId || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        time: initialData.time || '10:00 AM',
        reason: initialData.reason || '',
        status: initialData.status || 'Scheduled',
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.patientName.trim()) newErrors.patientName = 'Patient name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePatientSelect = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setFormData((prev) => ({ ...prev, patientId: '', patientName: '' }));
      return;
    }
    const found = patientsList.find((p) => p._id === selectedId);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        patientId: found._id,
        patientName: found.name,
      }));
      if (errors.patientName) {
        setErrors((prev) => ({ ...prev, patientName: '' }));
      }
    }
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
        {/* Quick select from existing patients if available */}
        {patientsList && patientsList.length > 0 && (
          <div className="col-12">
            <label htmlFor="patientSelect" className="form-label">
              Select From Existing Patient
            </label>
            <select
              id="patientSelect"
              className="form-select"
              value={formData.patientId}
              onChange={handlePatientSelect}
            >
              <option value="">-- Choose an existing patient or enter name below --</option>
              {patientsList.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.phoneNumber})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Patient Name */}
        <div className="col-12">
          <label htmlFor="patientName" className="form-label">
            Patient Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            className={`form-control ${errors.patientName ? 'is-invalid' : ''}`}
            placeholder="Enter patient full name"
            value={formData.patientName}
            onChange={handleChange}
            required
          />
          {errors.patientName && (
            <div className="invalid-feedback">{errors.patientName}</div>
          )}
        </div>

        {/* Date */}
        <div className="col-12 col-md-6">
          <label htmlFor="date" className="form-label">
            Appointment Date <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            className={`form-control ${errors.date ? 'is-invalid' : ''}`}
            value={formData.date}
            onChange={handleChange}
            required
          />
          {errors.date && <div className="invalid-feedback">{errors.date}</div>}
        </div>

        {/* Time */}
        <div className="col-12 col-md-6">
          <label htmlFor="time" className="form-label">
            Appointment Time <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="time"
            name="time"
            className={`form-control ${errors.time ? 'is-invalid' : ''}`}
            placeholder="e.g. 10:30 AM or 14:00"
            value={formData.time}
            onChange={handleChange}
            required
          />
          {errors.time && <div className="invalid-feedback">{errors.time}</div>}
        </div>

        {/* Reason / Notes */}
        <div className="col-12">
          <label htmlFor="reason" className="form-label">
            Reason / Notes
          </label>
          <textarea
            id="reason"
            name="reason"
            rows="3"
            className="form-control"
            placeholder="e.g. General checkup, blood pressure review, lab analysis..."
            value={formData.reason}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Status (if editing) */}
        {initialData && (
          <div className="col-12 col-md-6">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        )}

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
            <i className="bi bi-calendar-plus"></i>
            <span>{initialData ? 'Update Appointment' : 'Schedule Appointment'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default AppointmentForm;
