import React from 'react';

function AboutCompetencies({ data }) {
    return (
        <div className='about-competencies'>
            {data.map(point => (
                <article key={point.title} className='about-competencies-section'>
                    <h3>{point.title}</h3>
                    <p>{point.paragraph}</p>
                </article>
            ))}
        </div>
    );
}

export default AboutCompetencies;
