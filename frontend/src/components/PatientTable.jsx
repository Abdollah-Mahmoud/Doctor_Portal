import React from 'react';
import { Link } from 'react-router-dom';

const PatientTable = ({ patients, onDelete, onEdit }) => {
  if (!patients || patients.length === 0) {
    return (
      <div className="text-center py-5 text-muted bg-white rounded-3 border">
        <i className="bi bi-person-x display-4 text-secondary mb-3 d-block"></i>
        <h5 className="fw-semibold">No Patients Found</h5>
        <p className="small mb-3">Add a new patient or adjust your search filter.</p>
        <Link to="/patients/add" className="btn btn-primary btn-sm">
          <i className="bi bi-person-plus me-1"></i> Add First Patient
        </Link>
      </div>
    );
  }

  return (
    <div className="table-responsive bg-white rounded-3 border">
      <table className="table portal-table mb-0 align-middle">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Age / Gender</th>
            <th>Phone Number</th>
            <th>Medical History</th>
            <th>Notes</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient._id}>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle bg-light text-primary fw-bold d-flex align-items-center justify-content-center border"
                    style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}
                  >
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <Link
                      to={`/patients/${patient._id}`}
                      className="text-decoration-none fw-semibold text-dark text-hover-primary"
                    >
                      {patient.name}
                    </Link>
                  </div>
                </div>
              </td>
              <td>
                <span className="fw-medium">{patient.age} yrs</span>
                <span className="text-muted ms-1">({patient.gender})</span>
              </td>
              <td>
                <span className="text-nowrap">
                  <i className="bi bi-telephone text-muted me-1"></i>
                  {patient.phoneNumber}
                </span>
              </td>
              <td>
                <span
                  className="d-inline-block text-truncate"
                  style={{ maxWidth: '180px' }}
                  title={patient.medicalHistory || 'None'}
                >
                  {patient.medicalHistory || <span className="text-muted fst-italic">None</span>}
                </span>
              </td>
              <td>
                <span
                  className="d-inline-block text-truncate"
                  style={{ maxWidth: '180px' }}
                  title={patient.notes || 'None'}
                >
                  {patient.notes || <span className="text-muted fst-italic">—</span>}
                </span>
              </td>
              <td className="text-end">
                <div className="d-inline-flex gap-1">
                  {/* View Details */}
                  <Link
                    to={`/patients/${patient._id}`}
                    className="btn btn-sm btn-outline-primary btn-action"
                    title="View Patient Details"
                  >
                    <i className="bi bi-eye"></i>
                  </Link>

                  {/* Edit */}
                  {onEdit && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary btn-action"
                      onClick={() => onEdit(patient)}
                      title="Edit Patient"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                  )}

                  {/* Delete */}
                  {onDelete && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger btn-action"
                      onClick={() => onDelete(patient._id, patient.name)}
                      title="Delete Patient"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;
