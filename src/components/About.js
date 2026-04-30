import React from 'react';
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
 
export default About;
