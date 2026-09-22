import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PatientTable from '../components/PatientTable';
import PatientForm from '../components/PatientForm';
import patientService from '../services/patientService';

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // State for inline edit modal
  const [editingPatient, setEditingPatient] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err) {
      setAlert({
        type: 'danger',
        message: 'Failed to load patients list.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const nameMatch = patient.name?.toLowerCase().includes(term);
    const phoneMatch = patient.phoneNumber?.toLowerCase().includes(term);
    return nameMatch || phoneMatch;
  });

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete patient "${name}"? This will also remove their associated appointments.`)) {
      try {
        await patientService.delete(id);
        setAlert({
          type: 'success',
          message: `Patient "${name}" has been deleted.`,
        });
        loadPatients();
      } catch (err) {
        setAlert({
          type: 'danger',
          message: err.response?.data?.message || 'Error deleting patient.',
        });
      }
    }
  };

  const handleEditSubmit = async (formData) => {
    if (!editingPatient) return;
    try {
      setIsUpdating(true);
      await patientService.update(editingPatient._id, formData);
      setAlert({
        type: 'success',
        message: `Patient "${formData.name}" updated successfully.`,
      });
      setEditingPatient(null);
      loadPatients();
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Error updating patient.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Patient Management</h2>
          <p className="text-muted mb-0">
            View, search, edit, and manage all your clinic patients
          </p>
        </div>
        <Link to="/patients/add" className="btn btn-primary d-inline-flex align-items-center gap-2">
          <i className="bi bi-person-plus-fill"></i>
          <span>Add New Patient</span>
        </Link>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="portal-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6 col-lg-5">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
              placeholder="Search by name or phone number..."
            />
          </div>
          <div className="col-12 col-md-6 col-lg-7 text-md-end text-muted small">
            Showing <strong>{filteredPatients.length}</strong> of <strong>{patients.length}</strong> patient(s)
          </div>
        </div>
      </div>

      {/* Patient Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading patients...</span>
          </div>
        </div>
      ) : (
        <PatientTable
          patients={filteredPatients}
          onDelete={handleDelete}
          onEdit={(patient) => setEditingPatient(patient)}
        />
      )}

      {/* Edit Patient Modal / Overlay */}
      {editingPatient && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-pencil-square text-primary me-2"></i>
                  Edit Patient: {editingPatient.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingPatient(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4">
                <PatientForm
                  initialData={editingPatient}
                  onSubmit={handleEditSubmit}
                  isSubmitting={isUpdating}
                  onCancel={() => setEditingPatient(null)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
