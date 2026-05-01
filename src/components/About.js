import React from 'react';
import PropTypes from 'prop-types';
import AboutSection from "./AboutSection";

function About({ data }) {
    return (
        <main>
            {Object.entries(data.about).map(
                (value) =>  <AboutSection data={value} key={value[0]} />
            )}
        </main>
    );
}

About.propTypes = {
  data: PropTypes.shape({
    about: PropTypes.objectOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        img: PropTypes.string,
        paragraph: PropTypes.string.isRequired,
        items: PropTypes.array,
      })
    ).isRequired,
  }).isRequired,
};
 
export default About;
