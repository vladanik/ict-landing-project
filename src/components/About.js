import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AboutSection from "./AboutSection";

function About({ data }) {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
          const el = document.getElementById(location.hash.substring(1));
          if (el) {
            const yOffset = -20;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location.hash]);

    return (
        <main>
            <h1 className='page-header'>{data.companyName}</h1>
            {Object.entries(data.about).map(
                (value) =>  <AboutSection data={value} />
            )}
        </main>
    );
}
 
export default About;