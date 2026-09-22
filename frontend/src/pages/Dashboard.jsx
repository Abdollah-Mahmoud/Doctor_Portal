import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardCards from '../components/DashboardCards';
import SearchBar from '../components/SearchBar';
import PatientTable from '../components/PatientTable';
import AppointmentTable from '../components/AppointmentTable';
import patientService from '../services/patientService';
import appointmentService from '../services/appointmentService';

const Dashboard = () => {
  const { doctor } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, upcomingData, patientsData] = await Promise.all([
        appointmentService.getStats(),
        appointmentService.getUpcoming(),
        patientService.getAll(),
      ]);

      setStats(statsData);
      setUpcomingAppointments(upcomingData);
      setPatients(patientsData);
      setFilteredPatients(patientsData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setAlert({
        type: 'danger',
        message: 'Could not fetch dashboard data. Please check backend connection.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Filter patients by search term (name or phone)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = patients.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          (p.phoneNumber && p.phoneNumber.toLowerCase().includes(term))
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  // Handle patient deletion
  const handleDeletePatient = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete patient "${name}"?`)) {
      try {
        await patientService.delete(id);
        setAlert({
          type: 'success',
          message: `Patient "${name}" removed successfully.`,
        });
        fetchDashboardData();
      } catch (err) {
        setAlert({
          type: 'danger',
          message: err.response?.data?.message || 'Error deleting patient.',
        });
      }
    }
  };

  // Handle appointment status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      await appointmentService.update(id, { status: newStatus });
      setAlert({
        type: 'info',
        message: `Appointment status changed to ${newStatus}.`,
      });
      fetchDashboardData();
    } catch (err) {
      setAlert({
        type: 'danger',
        message: 'Error updating appointment status.',
      });
    }
  };

  // Handle appointment deletion
  const handleDeleteAppointment = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentService.delete(id);
        setAlert({
          type: 'success',
          message: 'Appointment deleted successfully.',
        });
        fetchDashboardData();
      } catch (err) {
        setAlert({
          type: 'danger',
          message: 'Error deleting appointment.',
        });
      }
    }
  };

  return (
    <div className="container">
      {/* Top Welcome Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1 text-dark">
            Welcome, {doctor?.name || 'Doctor'}
          </h2>
          <p className="text-muted mb-0">
            <span className="badge bg-primary-subtle text-primary me-2">
              {doctor?.specialty || 'General Practitioner'}
            </span>
            <span>Manage your patients, upcoming visits, and clinical notes.</span>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="d-flex gap-2">
          <Link to="/patients/add" className="btn btn-primary d-flex align-items-center gap-2">
            <i className="bi bi-person-plus-fill"></i>
            <span>Add Patient</span>
          </Link>
          <Link to="/appointments/add" className="btn btn-outline-primary d-flex align-items-center gap-2">
            <i className="bi bi-calendar-plus"></i>
            <span>Add Appointment</span>
          </Link>
        </div>
      </div>

      {/* Alert Banner */}
      {alert && (
        <div
          className={`alert alert-${alert.type} alert-dismissible fade show d-flex align-items-center gap-2`}
          role="alert"
        >
          <i
            className={`bi ${
              alert.type === 'success'
                ? 'bi-check-circle-fill'
                : alert.type === 'info'
                ? 'bi-info-circle-fill'
                : 'bi-exclamation-triangle-fill'
            } flex-shrink-0`}
          ></i>
          <div className="flex-grow-1">{alert.message}</div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlert(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Stats Cards */}
      <DashboardCards stats={stats} doctorSpecialty={doctor?.specialty} />

      {/* Search Patient Section */}
      <div className="portal-card p-4 mb-4">
        <div className="row align-items-center g-3">
          <div className="col-12 col-md-5">
            <h5 className="fw-bold mb-1">
              <i className="bi bi-search text-primary me-2"></i>Search Patient
            </h5>
            <p className="text-muted small mb-0">
              Lookup patient records instantly by full name or phone number.
            </p>
          </div>
          <div className="col-12 col-md-7">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
              placeholder="Search by patient name or phone number..."
            />
          </div>
        </div>

        {/* If user is actively searching, display search results directly */}
        {searchTerm.trim() && (
          <div className="mt-3 pt-3 border-top">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted">
                Found <strong>{filteredPatients.length}</strong> matching patient(s)
              </span>
              <button
                className="btn btn-link btn-sm text-decoration-none p-0"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </button>
            </div>
            <PatientTable
              patients={filteredPatients}
              onDelete={handleDeletePatient}
              onEdit={(p) => navigate(`/patients/${p._id}`)}
            />
          </div>
        )}
      </div>

      <div className="row g-4">
        {/* Upcoming Appointments Section */}
        <div className="col-12 col-xl-6">
          <div className="portal-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-info-subtle text-info p-2 rounded-2">
                  <i className="bi bi-calendar-event"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-0">Upcoming Appointments</h5>
                  <small className="text-muted">Next scheduled patient visits</small>
                </div>
              </div>
              <Link to="/appointments" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
              </div>
            ) : (
              <AppointmentTable
                appointments={upcomingAppointments}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteAppointment}
              />
            )}
          </div>
        </div>

        {/* View Patients Overview Section */}
        <div className="col-12 col-xl-6">
          <div className="portal-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-primary-subtle text-primary p-2 rounded-2">
                  <i className="bi bi-people"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-0">Recent Patients</h5>
                  <small className="text-muted">Recently added & treated patients</small>
                </div>
              </div>
              <Link to="/patients" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
              </div>
            ) : (
              <PatientTable
                patients={patients.slice(0, 5)}
                onDelete={handleDeletePatient}
                onEdit={(p) => navigate(`/patients/${p._id}`)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
