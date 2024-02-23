import React, { useState, useEffect } from 'react';
import './ProjectCard.css';

const ProjectCard = ({ title, description, resumelink }) => {

  const [isHovered, setIsHovered] = useState(false);

  // useEffect(() => {
  //   let titleIndex = 0;
  //   const titleIntervalId = setInterval(() => {
  //     setTitleText(prevText => prevText + title[titleIndex]);
  //     titleIndex++;
  //     if (titleIndex === title.length) {
  //       clearInterval(titleIntervalId);
  //       startDescriptionTyping();
  //     }
  //   }, 100);

  //   return () => clearInterval(titleIntervalId);
  // }, [title]);

  // const startDescriptionTyping = () => {
  //   let descriptionIndex = 0;
  //   const descriptionIntervalId = setInterval(() => {
  //     setDescriptionText(prevText => prevText + description[descriptionIndex]);
  //     descriptionIndex++;
  //     if (descriptionIndex === description.length) {
  //       clearInterval(descriptionIntervalId);
  //     }
  //   }, 2);
  // };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div 
      className={`project-card ${isHovered ? 'hovered' : ''}`} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => window.open(resumelink, '_blank')} // Keeping the click to redirect
    >
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="project-card-footer">Click me</div>
    </div>
  );
};

export default ProjectCard;
