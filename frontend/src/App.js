// frontend/src/App.js

import React from 'react';
import './App.css';
import HeroSection from './components/HeroSection/HeroSection';
import AboutSection from './components/AboutSection/AboutSection';
import EventsSection from './components/EventsSection/EventsSection';
import Footer from './components/Footer/Footer';

function App() {
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
      <EventsSection />
      <Footer />
    </div>
  );
}

export default App;
