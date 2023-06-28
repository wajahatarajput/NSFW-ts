import React from "react";
import "./tags-container.css";

const TagsContainer = ({ predictions }) => (
  <div className="tags-container">
    {predictions.map(
      (probability ) =>{
        const percentage = Math.round((probability * 100),5);
         return (
          <span className="tag"style={{  backgroundColor: percentage > 50 ? 'red' : 'black',  color: 'aliceblue'}}>
           {probability} | { percentage }%
          </span>
         )
      }
    )}
  </div>
);

export default TagsContainer;
