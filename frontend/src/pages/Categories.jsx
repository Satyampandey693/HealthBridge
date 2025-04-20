import Card from "../components/layout/UI/Card";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Categories.css";

export const Categories = () => {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    console.log("rendering");
    axios
      .get('/api/cards')
      .then((response) => {
        setCards(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCardClick = (card) => {
    console.log("Clicked Card:", card); 
    navigate(`/doctors/list?category=${encodeURIComponent(card.title)}`);
  };

  return (
    <>
      <h1>Categories</h1>
      <div className="cards-container">
        {cards.map((card, index) => (
          <span key={index} className="clickable-card" onClick={() => handleCardClick(card)}>
            <Card 
              photoUrl={card.photoUrl} 
              title={card.title} 
              description={card.description} 
            />
          </span>
        ))}
      </div>
    </>
  );
};
