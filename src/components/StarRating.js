
import React, { useState } from "react";
import axios from "axios";
import "./StarRating.css";
const StarRating = (props) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const id = props.id;

    console.log("id", id);
    const handleRating = async (index) => {
        const addRating = async () => {
          try {
            const response = await axios.post(`/rate/${id}`, {
              rating: index
            });
            console.log("response", response);
            setRating(index);
          } catch (error) {
            console.error("Error adding rating:", error);
          }
        };
      
        addRating();
      };

      props.func(rating);
      
    return (
      <div className="star-rating">
        {[...Array(5)].map((star, index) => {
          index += 1;
          return (
            <button
              type="button"
              key={index}
              className={index <= (hover || rating) ? "on" : "off"}
              onClick={() =>handleRating(index)}
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(rating)}
              onDoubleClick={() => {
                setRating(0);
                setHover(0);
                }}
            >
                
              <span className="star">&#9733;</span>
            </button>
          );
        })}
      </div>
    );
  };
export default StarRating;