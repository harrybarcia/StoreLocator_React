
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StarRating.css";
const StarRating = (props) => {
  console.log(props)
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const id = props.id;
    
    console.log("id", id);
    const handleRating = async (index) => {
        const addRating = async () => {
          try {
            await axios.post(`/rate/${id}`, {rating: index});           
          } catch (error) {
            console.error("Error adding rating:", error);
          }
        };
        addRating();
        setRating(index);
      };
      useEffect(() => {
        const fetchRating = async () => {
          try {
            const response = await axios.get(`/api/${id}`);
            console.log("response", response);
            setRating(response.data.rating);
          } catch (error) {
            console.error("Error fetching rating:", error);
          }
        };
        fetchRating();
        setRating(rating);
      }, [rating]);
      console.log(rating)
      // props.func();
      
    return (
      <div className="star-rating">
        {[...Array(5)].map((star, index) => {
          // index is the index of the star in the array, it doesn't vary
          // hover is the index of the star that is being hovered over
          index += 1;
          return (
            <button
              type="button"
              key={index}
              // if the index of the star is less than or equal to the index of the star being hovered over, then the star is "on"
              className={index <= (hover || rating) ? "on" : "off"}
              onClick={() =>handleRating(index)}
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(rating)}
            >
              <span className="star">&#9733;</span>
            </button>
          );
        })}
      </div>
    );
  };
export default StarRating;