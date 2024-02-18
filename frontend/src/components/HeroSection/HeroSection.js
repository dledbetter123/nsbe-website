import React, { useEffect, useState } from 'react';
import './HeroSection.css';
import nsbeimg from "./images/umbcnsbe.png"

const HeroSection = () => {
  const finalText = "EMPOWERING INNOVATION.";
  const [text, setText] = useState(' '.repeat(finalText.length));
  const [textStyle, setTextStyle] = useState({});

  // Function to generate a random printable character from the Basic Latin block
  const getRandomCharacter = () => {
    const min = 0x02200;
    const max = 0x022D5;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return String.fromCharCode(randomNumber);
  };

  useEffect(() => {
    let currentCharIndex = 0; // Index of the current character being finalized
    const maxCycles = 3; // Maximum cycles for each character
    let cyclesCompleted = 0; // Cycles completed for the current character

    const updateText = () => {
      setText((prevText) => {
        let newText = prevText.split('').map((char, index) => {
          if (index < currentCharIndex) {
            // Characters to the left of the current one are already finalized
            return finalText[index];
          } else if (index === currentCharIndex && cyclesCompleted < maxCycles) {
            // Current character is cycling
            return getRandomCharacter();
          } else if (index > currentCharIndex) {
            // Characters to the right continue to cycle
            return getRandomCharacter();
          }
          return char; // Should not hit this case
        }).join('');

        // Increment cycle count or move to next character
        if (cyclesCompleted >= maxCycles) {
          currentCharIndex++;
          cyclesCompleted = 0;
          // Settle the current character to its final form
          newText = newText.split('');
          newText[currentCharIndex - 1] = finalText[currentCharIndex - 1];
          newText = newText.join('');
        } else {
          cyclesCompleted++;
        }

        if (currentCharIndex >= finalText.length) {
          // Animation complete, ensure text is finalized
          clearInterval(intervalId);
          return finalText;
        }

        const progress = currentCharIndex / finalText.length;
        const scale = 1 + 0.2 * progress; // Gradually scale up to 1.2x
        const brightness = 100 + 50 * progress; // Increase brightness up to 150%
        setTextStyle({
          transform: `scale(${scale})`,
          filter: `brightness(${brightness}%)`,
          color: progress === 1 ? '#FFD700' : '', // Gold color when completed
          fontSize: 36
        });

        return newText;
      });
    };

    const intervalId = setInterval(updateText, 1500 / (finalText.length * maxCycles));

    return () => clearInterval(intervalId);
  }, [finalText]);

  return (
    <div className="hero-container">
      <img src={nsbeimg} alt="Overlay" className="hero-overlay"/>
      <div className="hero">
        <h1 className="fancy-text" style={textStyle}>{text}</h1>
        <p style={{ paddingBottom: "3vh"}}>Learn more about our community of engineering excellence.</p>
        <button className='button'>Meet our members</button>
      </div>
    </div>
  );
};

export default HeroSection;
