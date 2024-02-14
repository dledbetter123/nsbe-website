// frontend/src/components/MembersSection/MembersSection.js

import React from 'react';
import './MembersSection.css';

const MembersSection = () => {
    return (
        <div id="members" className="members-section">
            <div className="members-content">
                <h2>Our Members</h2>
                <p>Meet the brilliant minds that form the backbone of NSBE UMBC. Our members are passionate students and professionals dedicated to excellence in engineering and leadership in the community.</p>
                {/* Member profiles or additional content goes here */}
            </div>
        </div>
    );
};

export default MembersSection;
