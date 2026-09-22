import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppointmentTable from '../components/AppointmentTable';
import appointmentService from '../services/appointmentService';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (err) {
      setAlert({
        type: 'danger',
        message: 'Failed to load appointments.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await appointmentService.update(id, { status: newStatus });
      setAlert({
        type: 'info',
        message: `Appointment status updated to ${newStatus}.`,
      });
      loadAppointments();
    } catch (err) {
      setAlert({
        type: 'danger',
        message: 'Could not update status.',
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentService.delete(id);
        setAlert({
          type: 'success',
          message: 'Appointment deleted successfully.',
        });
        loadAppointments();
      } catch (err) {
        setAlert({
          type: 'danger',
          message: 'Could not delete appointment.',
        });
      }
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    // Filter by status tab
    if (filterStatus !== 'ALL' && appt.status !== filterStatus) {
      return false;
    }
    // Filter by search query
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchPatient = appt.patientName?.toLowerCase().includes(term);
      const matchReason = appt.reason?.toLowerCase().includes(term);
      return matchPatient || matchReason;
    }
    return true;
  });

  return (
    <div className="container">
      {/* Page Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Appointments Schedule</h2>
          <p className="text-muted mb-0">
            Organize patient consultations, dates, and times
          </p>
        </div>
        <Link to="/appointments/add" className="btn btn-primary d-inline-flex align-items-center gap-2">
          <i className="bi bi-calendar-plus"></i>
          <span>Schedule Appointment</span>
        </Link>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="portal-card p-3 mb-4">
        <div className="row g-3 align-items-center justify-content-between">
          {/* Status Tabs */}
          <div className="col-12 col-md-7">
            <div className="btn-group btn-group-sm w-100 w-md-auto" role="group">
              {['ALL', 'Scheduled', 'Completed', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`btn ${
                    filterStatus === status ? 'btn-primary' : 'btn-outline-secondary'
                  }`}
                  onClick={() => setFilterStatus(status)}
                >
                  {status === 'ALL' ? 'All Visits' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filter Search */}
          <div className="col-12 col-md-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Filter by patient name or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setSearchTerm('')}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading appointments...</span>
          </div>
        </div>
      ) : (
        <AppointmentTable
          appointments={filteredAppointments}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Appointments;
