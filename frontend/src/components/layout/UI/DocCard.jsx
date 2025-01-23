import './DocCard.css'; // For custom styles

export const DocCard = ({ photoUrl, name, consultancyFee, rating }) => {
  return (
    <div className="card">
      <img src={photoUrl} alt={name} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{name}</h2>
        <p className="card-description">Consultancy Fee: {consultancyFee}</p>
        <p className="card-description">Rating: {rating}</p>
      </div>
    </div>
  );
};
