import React from 'react';

const AppointmentTable = ({ appointments, onStatusChange, onDelete }) => {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-4 text-muted bg-white rounded-3 border">
        <i className="bi bi-calendar-x display-5 text-secondary mb-2 d-block"></i>
        <p className="mb-0 fw-medium">No appointments scheduled</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-success-subtle text-success border border-success-subtle';
      case 'Cancelled':
        return 'bg-danger-subtle text-danger border border-danger-subtle';
      case 'Scheduled':
      default:
        return 'bg-primary-subtle text-primary border border-primary-subtle';
    }
  };

  return (
    <div className="table-responsive bg-white rounded-3 border">
      <table className="table portal-table mb-0 align-middle">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Date & Time</th>
            <th>Reason / Notes</th>
            <th>Status</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt._id}>
              <td>
                <span className="fw-semibold text-dark">{appt.patientName}</span>
              </td>
              <td>
                <div className="d-flex flex-column">
                  <span className="fw-medium text-nowrap">
                    <i className="bi bi-calendar3 me-1 text-muted"></i>
                    {appt.date}
                  </span>
                  <small className="text-muted text-nowrap">
                    <i className="bi bi-clock me-1"></i>
                    {appt.time}
                  </small>
                </div>
              </td>
              <td>
                <span
                  className="d-inline-block text-truncate"
                  style={{ maxWidth: '240px' }}
                  title={appt.reason || 'Routine consultation'}
                >
                  {appt.reason || <span className="text-muted fst-italic">Routine Consultation</span>}
                </span>
              </td>
              <td>
                <span className={`badge badge-status ${getStatusBadge(appt.status)}`}>
                  {appt.status}
                </span>
              </td>
              <td className="text-end">
                <div className="d-inline-flex align-items-center gap-1">
                  {onStatusChange && (
                    <select
                      className="form-select form-select-sm d-inline-block w-auto py-1 pe-4"
                      style={{ fontSize: '0.8rem' }}
                      value={appt.status}
                      onChange={(e) => onStatusChange(appt._id, e.target.value)}
                      aria-label="Change appointment status"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  )}

                  {onDelete && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger btn-action ms-1"
                      onClick={() => onDelete(appt._id)}
                      title="Delete Appointment"
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

export default AppointmentTable;
