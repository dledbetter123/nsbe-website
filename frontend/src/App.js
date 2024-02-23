// frontend/src/App.js

import React, { useState, useEffect }from 'react';
import './App.css';
import HeroSection from './components/HeroSection/HeroSection';
import AboutSection from './components/AboutSection/AboutSection';
import EventsSection from './components/EventsSection/EventsSection';
import ImpactSection from './components/ImpactSection/ImpactSection';
import ProjectCard from './components/ProjectCard/ProjectCard';
import Footer from './components/Footer/Footer';
import Carousel from './components/SwipeableGridPage/Carousel';


function App() {

  const [items, setItems] = useState([])
  useEffect(() => {
    const fetchUsers = async () => {
      console.log("Prior to response");
      const response = await fetch('http://nsbebackend22.us-east-1.elasticbeanstalk.com/members/list');
      console.log(response);
      const data = await response.json();
      setItems(data.map(user => ({
        content: (
          <ProjectCard
            title={user.fullName}
            description={user.shortBio}
            resumelink={user.resumeLink}
          />
        )
      })));
    };
    fetchUsers();

  }, []);



  return (
    <div className="App">
      {/* <header className="App-header">
        <nav>
          <ul className="nav-links">
            <li><Link to="home" smooth={true} duration={1000}>Home</Link></li>
            <li><Link to="about" smooth={true} duration={1000}>About</Link></li>
            <li><Link to="events" smooth={true} duration={1000}>Events</Link></li>
          </ul>
        </nav>
      </header> */}
      <HeroSection />
      <AboutSection />
      <ImpactSection />
      <EventsSection />
      <div className='users'>
      <Carousel items={items}/>
      </div>
      <Footer />
    </div>
  );
}

export default App;
