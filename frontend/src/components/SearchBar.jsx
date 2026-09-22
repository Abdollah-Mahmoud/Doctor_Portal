import React from 'react';

const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search by patient name or phone number...',
  onClear,
}) => {
  return (
    <div className="search-wrapper w-100">
      <i className="bi bi-search search-icon"></i>
      <input
        type="text"
        className="form-control search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search"
      />
      {value && (
        <button
          type="button"
          className="btn btn-link text-muted position-absolute end-0 top-50 translate-middle-y text-decoration-none pe-3"
          onClick={onClear}
          aria-label="Clear search"
          style={{ zIndex: 5 }}
        >
          <i className="bi bi-x-circle-fill"></i>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
