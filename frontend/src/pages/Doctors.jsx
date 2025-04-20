import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import DocCard from "../components/layout/UI/DocCard";
import "./Doctors.css";

export const Doctors = () => {
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [triggerSearch, setTriggerSearch] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  useEffect(() => {
    let url = "/api/doctors";
    if (category) {
      url += `?category=${encodeURIComponent(category)}`;
    }

    axios
      .get(url)
      .then((response) => {
        setCards(response.data);
        setFilteredCards(response.data);
      })
      .catch((error) => {
        console.log("Error fetching doctors:", error);
      });
  }, [category]);

  // Run search only when button is clicked
  useEffect(() => {
    const lowerName = searchName.toLowerCase();
    const lowerCity = searchCity.toLowerCase();

    const filtered = cards.filter((doc) => {
      const matchesName = doc.name.toLowerCase().includes(lowerName);
      const matchesCity = doc.city.toLowerCase().includes(lowerCity);
      return matchesName && matchesCity;
    });

    setFilteredCards(filtered);
  }, [triggerSearch]);

  const handleSearchClick = () => {
    setTriggerSearch(!triggerSearch); // Toggle to trigger useEffect
  };

  const handleCardClick = (card) => {
    navigate(`/doctors/list?category=${category}&id=${card._id}`);
  };

  return (
    <>
      <h1>{`${category}`}</h1>

      {/* 🔍 Search Section */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by city"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
        <button className="search-button" onClick={handleSearchClick}>
          Search
        </button>
      </div>

      {/* 🩺 Doctors List */}
      <div className="cards-container">
        {Array.isArray(filteredCards) && filteredCards.length > 0 ? (
          filteredCards.map((card, index) => (
            <span key={index} className="clickable-card" onClick={() => handleCardClick(card)}>
              <DocCard
                name={card.name}
                city={card.city}
                experience={card.experience}
                rating={card.rating}
              />
            </span>
          ))
        ) : (
          <p>No doctors found for this category or search.</p>
        )}
      </div>
    </>
  );
};
