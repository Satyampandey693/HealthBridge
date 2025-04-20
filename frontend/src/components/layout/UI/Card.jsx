import React from 'react';
import PropTypes from "prop-types";
import './Card.css'; // For custom styles, if necessary

const Card = ({ photoUrl, description, title }) => {
  return (
    <div className="card">
      <img src={photoUrl} alt={title} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );
};
Card.propTypes = {
  title: PropTypes.string,
  photoUrl: PropTypes.string,
  description: PropTypes.string
};
export default Card;
