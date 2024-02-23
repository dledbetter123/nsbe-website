import React, { useEffect, useState } from 'react';
import './HeroSection.css';
import nsbeimg from "./images/umbcnsbe.png"

const HeroSection = () => {
  const finalText = "EMPOWERING INNOVATION.";
  const [text, setText] = useState(' '.repeat(finalText.length));
  const [textStyle, setTextStyle] = useState({});

  const getRandomCharacter = () => {
    const min = 0x02200;
    const max = 0x022D5;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return String.fromCharCode(randomNumber);
  };

  useEffect(() => {
    let currentCharIndex = 0;
    const maxCycles = 3;
    let cyclesCompleted = 0;

    const updateText = () => {
      setText((prevText) => {
        let newText = prevText.split('').map((char, index) => {
          if (index < currentCharIndex) {
            return finalText[index];
          } else if (index === currentCharIndex && cyclesCompleted < maxCycles) {
            return getRandomCharacter();
          } else if (index > currentCharIndex) {
            return getRandomCharacter();
          }
          return char;
        }).join('');

        // increment cycle count or move to next character
        if (cyclesCompleted >= maxCycles) {
          currentCharIndex++;
          cyclesCompleted = 0;
          // settle the current character to its final form
          newText = newText.split('');
          newText[currentCharIndex - 1] = finalText[currentCharIndex - 1];
          newText = newText.join('');
        } else {
          cyclesCompleted++;
        }

        if (currentCharIndex >= finalText.length) {
          // ensure text is finalized
          clearInterval(intervalId);
          return finalText;
        }

        const progress = currentCharIndex / finalText.length;
        const scale = 1 + 0.2 * progress;
        const brightness = 150 - 50 * progress;
        setTextStyle({
          transform: `scale(${scale})`,
          filter: `brightness(${brightness}%)`,
          color: progress === 1 ? '#FFD700' : '', // Gold color when completed
          fontSize: 36
        });

        return newText;
      });
    };

    const intervalId = setInterval(updateText, 2000 / (finalText.length * maxCycles));

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
