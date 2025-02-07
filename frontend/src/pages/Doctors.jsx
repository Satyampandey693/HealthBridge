import { useState, useEffect } from 'react';
import { DocCard } from '../components/layout/UI/DocCard';
import { useNavigate } from "react-router-dom"; 

export const Doctors = () => {
  const [nameQuery, setNameQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate=useNavigate();

  useEffect(() => {
    console.log("Results updated:", results);
  }, [results]);

  const handleSearch = async () => {
    const queryParams = new URLSearchParams();
    if (nameQuery) queryParams.append("name", nameQuery);
    if (cityQuery) queryParams.append("city", cityQuery);

    const response = await fetch(`/api/doctors/search?${queryParams.toString()}`);
    const data = await response.json();

    console.log("API Response:", data);
    setResults([...data]); 
    console.log(results);
  };
  const handleCardClick = (doctor) => {
    console.log("Clicked Card:", doctor); 
    navigate(`/${doctor.name}`); 
  };

  return (
    <div className="search-page">
      <h1>Search Doctors</h1>
      <div className="search-inputs">
        <input
          type="text"
          placeholder="Search by Name"
          value={nameQuery}
          onChange={(e) => setNameQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by City"
          value={cityQuery}
          onChange={(e) => setCityQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="results">
        {console.log("Rendered Results:", results)}
        {results.length > 0 ? (
          <ul>
            {results.map((doctor,index) => (
             <span key={index} className="clickable-card" onClick={() => handleCardClick(doctor)}>
              <DocCard 
              photoUrl=""
              name={doctor.name} 
              fees={doctor.fee}
              rating={doctor.rating}
              experience={doctor.experience}
              city={doctor.city} 
              />
             </span>
            ))}
          </ul>
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

