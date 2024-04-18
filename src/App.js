import React, { Component, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes as Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AboutMe from './components/AboutMe';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';
import Languages from './components/Languages';
import Certificates from './components/Certificates';
import ContactForm from './components/ContactForm';
import Services from './components/Services';
import './App.css';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch ('/data.json');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return <LoadingSpinner />;
  }

  return (
      <div className='App'>
        <Header />

        <div className='grid-container'>
          <div className='grid-item' id='aboutMeItem'>
            <AboutMe data={data.aboutMe} />
          </div>
          <div className='grid-item secition secition-photo' id='imgItem'>
            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB6OSTLKi9S9XmpdpGzzUr0SuSxjbEIBN2ZAxwermjhQ&s' width='100%' />
          </div>
          <div className='grid-item' id='experienceItem'>
            <Experience data={data.experience} />
          </div>
          <div className='grid-item' id='projectsItem'>
            <Projects data={data.projects} />
          </div>
          <div className='grid-item' id='educationItem'>
            <Education data={data.education} />
          </div>
          <div className='grid-item' id='skillsItem'>
            <Skills data={data.skills} />
          </div>
          <div className='grid-item' id='certificatesItem'>
            <Certificates data={data.certificates} />
          </div>
          <div className='grid-item' id='languagesItem'>
            <Languages data={data.languages} />
          </div>
          <div className='grid-item' id='servicesItem'>
            <Services data={data.services} />
          </div>
        </div>
        
        
        
        
        
        
        
        


        {/* <ContactForm /> */}
        <Footer />
      </div>
  );
}

export default App;
