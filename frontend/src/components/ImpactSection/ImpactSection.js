import React, { useRef, useEffect, useMemo } from 'react';
import './ImpactSection.css';
import img1 from './images/IMG_6441.jpeg';
import img2 from './images/IMG_4674.mp4';
import img3 from './images/NSBEgbm.jpeg';

const Portfolio = () => {
    const works = useMemo(() => [
        {
          id: 1,
          mediaSrc: img1,
          title: 'Academic Recognition',
          description: 'Our organization helps organize and host schoolwide networking events',
          link: '#',
          type: 'image',
        },
        {
          id: 2,
          mediaSrc: img2,
          title: 'Workshops',
          description: 'We develop workshops that help our chapter learn a specific skill such as professional networking or web development',
          link: '#',
          type: 'video',
        },
        {
          id: 3,
          mediaSrc: img3,
          title: 'Weekly General Body Meetings',
          description: 'We hold weekly general body meetings to engage our chapter in skill building or mental health exercises, and to learn about the challenges they face in their journey to becoming engineers',
          link: '#',
          type: 'image',
        },
      ], []); // Dependencies array is empty, meaning this only runs once, perfect

    // ref for each video element
    const videoRefs = useRef([]);

    useEffect(() => {
    // initialize refs
    videoRefs.current = videoRefs.current.slice(0, works.length);
    }, [works]);

    const handleMouseEnter = (index) => {
    if (works[index].type === 'video' && videoRefs.current[index]) {
        videoRefs.current[index].play();
    }
    };

    const handleMouseLeave = (index) => {
    if (works[index].type === 'video' && videoRefs.current[index]) {
        videoRefs.current[index].pause();
    }
    };

    return (
    <div id="portfolio" className="portfolio-section">
        <div className="container">
        <h1 style={{ color: 'white' }}>Our Impact</h1>
        <div className="work-list">
            {works.map((work, index) => (
            <div 
                className="work" 
                key={work.id}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
            >
                {work.type === 'image' && (
                <img src={work.mediaSrc} alt={work.title} />
                )}
                {work.type === 'video' && (
                <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={work.mediaSrc}
                    loop
                    muted
                    playsInline
                    style={{ width: '100%', borderRadius: '10px' }}
                />
                )}
                <div className="layer">
                <h3 style={ {fontSize: '30px', color: 'white'} }>{work.title}</h3>
                <p style={ {fontSize: '22px', color: 'white'} }>{work.description}</p>
                <a href={work.link} className="view-project">View Project</a>
                </div>
            </div>
            ))}
        </div>
        </div>
    </div>
    );
};

export default Portfolio;
// style={{ color: 'white' }}