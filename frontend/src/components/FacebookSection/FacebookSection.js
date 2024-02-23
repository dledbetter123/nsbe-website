import React, { useEffect, useState } from 'react';
import Carousel from '../SwipeableGridPage/Carousel';
import ProjectCard from '../ProjectCard/ProjectCard';
const UsersPanel = ({ users }) => {
  const carouselItems = users.map(user => ({
    content: (
      <ProjectCard
        title={user.fullName}
        description={user.shortBio}
        resumelink={user.resumeLink}
      />
    )
  }));

  return (
    <Carousel items={carouselItems}/>
  );
};

export default UsersPanel;
