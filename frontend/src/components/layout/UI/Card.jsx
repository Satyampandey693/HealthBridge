import React from 'react';
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

export default Card;
