import React from 'react';
import PropTypes from 'prop-types';

const BreadcrumbItem = ({ label, href, isActive }) => {
  if (isActive) {
    return <li className="breadcrumb-item active" aria-current="page">{label}</li>;
  } else {
    return (
      <li className="breadcrumb-item">
        <a href={href}>{label}</a>
      </li>
    );
  }
};

BreadcrumbItem.propTypes = {
  label: PropTypes.string.isRequired,
  href: PropTypes.string,
  isActive: PropTypes.bool,
};

BreadcrumbItem.defaultProps = {
  href: '#',
  isActive: false,
};

export default BreadcrumbItem;
