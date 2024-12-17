import React from 'react';

function AboutCompetencies({ data }) {
    return (
        <div className='about-competencies'>
            {data.map(point => (
                <div key={point.title} className='section about-competencies-section'>
                    <h6>{point.title}</h6>
                    <p>{point.paragraph}</p>
                </div>
            ))}
        </div>
    );
}

export default AboutCompetencies;