import React, { Component, useEffect } from 'react';
import AboutMe from './AboutMe';
import Experience from './Experience';
import Education from './Education';
import Certificates from './Certificates';
import Skills from './Skills';
import Languages from './Languages';
import { useLocation } from 'react-router-dom';

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
            <h1 className='page-header'>ICT Uladzislau Danik</h1>
            <AboutMe data={data.aboutMe} />
            <div id='skillsLanguagesEducation'>
                <Skills data={data.skills} />
                <Languages data={data.languages} />
                <Education data={data.education} />
            </div>
            <div id='experienceCertificates'>
                <Experience data={data.experience} />
                <Certificates data={data.certificates} />
            </div>
        </main>
    );
}
 
export default About;