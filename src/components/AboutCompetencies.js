import React from 'react';
import PropTypes from 'prop-types';

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

AboutCompetencies.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      paragraph: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AboutCompetencies;
