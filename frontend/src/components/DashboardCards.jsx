import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCards = ({ stats, doctorSpecialty }) => {
  const cards = [
    {
      title: 'Total Patients',
      value: stats?.totalPatients ?? 0,
      icon: 'bi-people-fill',
      colorClass: 'text-primary',
      bgClass: 'bg-primary-subtle',
      link: '/patients',
      linkText: 'View all patients',
    },
    {
      title: "Today's Appointments",
      value: stats?.todayAppointments ?? 0,
      icon: 'bi-calendar-check-fill',
      colorClass: 'text-success',
      bgClass: 'bg-success-subtle',
      link: '/appointments',
      linkText: 'Check schedule',
    },
    {
      title: 'Upcoming Scheduled',
      value: stats?.upcomingAppointments ?? 0,
      icon: 'bi-clock-history',
      colorClass: 'text-info',
      bgClass: 'bg-info-subtle',
      link: '/appointments',
      linkText: 'Manage appointments',
    },
    {
      title: 'Practice Specialty',
      value: doctorSpecialty || 'General Medicine',
      isText: true,
      icon: 'bi-hospital-fill',
      colorClass: 'text-warning',
      bgClass: 'bg-warning-subtle',
      link: '/profile',
      linkText: 'Doctor profile',
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {cards.map((card, index) => (
        <div className="col-12 col-sm-6 col-xl-3" key={index}>
          <div className="portal-card p-3 h-100 d-flex flex-column justify-content-between">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                  {card.title}
                </span>
                <h3 className={`fw-bold mb-0 mt-1 ${card.isText ? 'fs-5 text-truncate' : 'fs-2'}`} style={{ maxWidth: card.isText ? '180px' : 'none' }}>
                  {card.value}
                </h3>
              </div>
              <div className={`stat-icon-wrapper ${card.bgClass} ${card.colorClass}`}>
                <i className={`bi ${card.icon}`}></i>
              </div>
            </div>
            <div className="border-top pt-2">
              <Link to={card.link} className="text-decoration-none small text-primary fw-medium d-flex align-items-center gap-1">
                <span>{card.linkText}</span>
                <i className="bi bi-arrow-right" style={{ fontSize: '0.75rem' }}></i>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
