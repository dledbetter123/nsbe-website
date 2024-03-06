// src/components/Navbar/Navbar.js
import React from 'react';
import { Link } from 'react-scroll'; // For smooth scrolling
import './Navbar.css'; // Assuming you have a CSS file for styling your navbar

const Navbar = ({ onLoginClick, onSignUpClick }) => {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li><Link to="aboutSection" smooth={true} duration={1000}>About</Link></li>
        <li><Link to="impactSection" smooth={true} duration={1000}>Impact</Link></li>
        <li><Link to="membersSection" smooth={true} duration={1000}>Members</Link></li>
        <li><button onClick={onLoginClick}>Login</button></li>
        <li><button onClick={onSignUpClick}>Sign Up</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
