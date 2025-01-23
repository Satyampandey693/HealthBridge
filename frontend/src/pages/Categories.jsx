import Card from "../components/layout/UI/Card";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import "./Categories.css";

export const Categories = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    axios
      .get('/api/cards')
      .then((response) => {
        setCards(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); // This makes the API call only once when the component mounts

  return (
    <>
      <h1>Categories</h1>
      <div className="cards-container">
        {cards.map((card, index) => (
          <span key={index}>
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
