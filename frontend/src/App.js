// frontend/src/App.js

import React, { useState, useEffect, useRef }from 'react';
import './App.css';
import HeroSection from './components/HeroSection/HeroSection';
import AboutSection from './components/AboutSection/AboutSection';
import EventsSection from './components/EventsSection/EventsSection';
import ImpactSection from './components/ImpactSection/ImpactSection';
import ProjectCard from './components/ProjectCard/ProjectCard';
import Footer from './components/Footer/Footer';
import Carousel from './components/SwipeableGridPage/Carousel';
import Navbar from './components/Navbar/Navbar';
import SignUpFormDialog from './components/SignUpFormDialog/SignUpFormDialog';


function App() {
  const carouselRef = useRef(null);
  const [items, setItems] = useState([])
  const usersDivRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  // const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  // const handleLoginClick = () => setIsLoginOpen(true);
  const handleSignUpClick = () => setIsSignUpOpen(true);

  // const closeLoginDialog = () => setIsLoginOpen(false);
  const toggleSignUpDialog = () => setIsSignUpOpen(!isSignUpOpen);



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
            headshotlink={user.pictureLink}
          />
        )
      })));
    };
    fetchUsers();

  }, []);

  useEffect(() => {
    const handleWheelEvent = (e) => {
      if (carouselRef.current) {
        carouselRef.current.handleWheel(e);
      }
    };
  
    const usersDiv = usersDivRef.current;
    if (usersDiv) {
      usersDiv.addEventListener('wheel', handleWheelEvent, { passive: false });
    }
  
    return () => {
      if (usersDiv) {
        usersDiv.removeEventListener('wheel', handleWheelEvent);
      }
    };
  }, []);
  

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase().trim());
    console.log("Search Query:", searchQuery); // Debugging line
  };

  useEffect(() => {
    if (searchQuery === '') {
      // Optionally reset the carousel or handle empty query differently
      return;
    }
  
    const targetIndex = items.findIndex(item => {
      const title = item.content.props.title.toLowerCase();
      // console.log("Comparing to:", title); // Debugging line
      return title.includes(searchQuery);
    });
  
    if (targetIndex !== -1) {
      carouselRef.current.goToIndex(targetIndex);
      console.log("moved");
    } else {
      console.log("No match found"); // For debugging
    }
  }, [searchQuery, items]); // Depend on searchQuery and items

  return (
    <div className="App">
      <Navbar onSignUpClick={toggleSignUpDialog} />
      <SignUpFormDialog isOpen={isSignUpOpen} onClose={toggleSignUpDialog} />
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
      <div className='users' ref={usersDivRef}>
      <div className="search-container">
      <input
        type="text"
        className="search-bar"
        placeholder="Search for a member..."
        onChange={handleSearchChange}
      />
    </div>
      <Carousel ref={carouselRef} items={items}/>
      </div>
      <Footer />
    </div>
  );
}

export default App;
