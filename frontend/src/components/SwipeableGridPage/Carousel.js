// frontend/src/components/SwipeableGridPage/Carousel.js

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import './Carousel.css';

const Carousel = forwardRef(({ items }, ref) => {
  const [actionQueue, setActionQueue] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  let accumulatedDeltaX = 0; // Accumulator for the wheel's deltaX
  const deltaXThreshold = 200; // Threshold to trigger slide change

  // Enhanced touch tracking
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const swipeThreshold = 50;

  const [isTransitioning, setIsTransitioning] = useState(false); // lock to prevent bouncing

  const handleTransitionEnd = () => {
    setIsTransitioning(false); // Reset transition state when transition completes
  };

  useEffect(() => {
    if (!isTransitioning && actionQueue.length > 0) {
      const nextAction = actionQueue[0]; // pop next action
      nextAction(); // execute
      setActionQueue(currentQueue => currentQueue.slice(1));
    }
  }, [isTransitioning, actionQueue]); // reacts to changes in isTransitioning or actionQueue
  

  const enqueueAction = (action) => {
    setActionQueue(currentQueue => [...currentQueue, action]);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setActiveIndex((current) => (current + 1) % items.length);
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setActiveIndex((current) => (current === 0 ? items.length - 1 : current - 1));
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > swipeThreshold) {
      goToNext();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      goToPrev();
    }
    // might reset touchStartX and touchEndX here
  };


  useImperativeHandle(ref, () => ({
    handleWheel: (e) => {
      e.preventDefault();
      accumulatedDeltaX += e.deltaX;
  
      if (Math.abs(accumulatedDeltaX) > deltaXThreshold) {
        if (accumulatedDeltaX > 0) {
          goToNext();
        } else {
          goToPrev();
        }
        accumulatedDeltaX = 0;
      }
    },
    goToNext: () => {
      if (isTransitioning) return;
      setActiveIndex((current) => (current + 1) % items.length);
      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    },
    goToPrev: () => {
      if (isTransitioning) return;
      setActiveIndex((current) => (current === 0 ? items.length - 1 : current - 1));
      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    },
    goToIndex: (index) => {
      const action = () => {
        if (isTransitioning) return;
        setActiveIndex(index);
        setIsTransitioning(true);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 500);
      };

      if (isTransitioning) {
        enqueueAction(action);
      } else {
        action();
      }

    }    
  }));

  // useEffect(() => {
  //   const handleWheel = (e) => {
  //     e.preventDefault();
  //     accumulatedDeltaX += e.deltaX;
  
  //     if (Math.abs(accumulatedDeltaX) > deltaXThreshold) {
  //       if (accumulatedDeltaX > 0) {
  //         goToNext();
  //       } else {
  //         goToPrev();
  //       }
  //       accumulatedDeltaX = 0;
  //     }
  //   };

  //   function debounce(func, wait) {
  //     let timeout;
  //     return function executedFunction(...args) {
  //       const later = () => {
  //         clearTimeout(timeout);
  //         func(...args);
  //       };
  //       clearTimeout(timeout);
  //       timeout = setTimeout(later, wait);
  //     };
  //   }

  //   const debouncedHandleWheel = debounce(handleWheel, 200);
  //   const container = document.querySelector('.carousel-container');
  //   container.addEventListener('wheel', handleWheel, { passive: false });

  //   return () => {
  //     container.removeEventListener('wheel', debouncedHandleWheel);
  //   };
  // }, [goToNext, goToPrev]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      goToNext();
    } else if (e.key === 'ArrowLeft') {
      goToPrev();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, isTransitioning]);

  return (
    <div className="carousel-container">
      <div className="carousel-arrow left" onClick={goToPrev}>
          &#9664; {/* Unicode left-pointing arrow */}
      </div>
      <div
        className="carousel-wrapper"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTransitionEnd={handleTransitionEnd}
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
          transition: isTransitioning ? 'transform 0.5s ease' : 'none',
        }}
      >
        {items.map((item, index) => (
          <div key={index} className="carousel-item">
            {item.content}
          </div>
        ))}
      </div>

      <div className="carousel-arrow right" onClick={goToNext}>
          &#9654; {/* Unicode right-pointing arrow */}
      </div>
      {/* <button onClick={goToPrev} className="carousel-prev">Prev</button>
      <button onClick={goToNext} className="carousel-next">Next</button> */}
    </div>
  );
});

export default Carousel;
