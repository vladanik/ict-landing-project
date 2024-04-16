import React, { Component } from 'react';
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

function App() {
  return (
    <Router>
      <div className='App'>
        <Header />
        <Switch>
          <Route exact path='/' Component={AboutMe} />
          <Route path='/experience' Component={Experience} />
          <Route path='/projects' Component={Projects} />
          <Route path='/skills' Component={Skills} />
          <Route path='/education' Component={Education} />
          <Route path='/languages' Component={Languages} />
          <Route path='/certificates' Component={Certificates} />
          <Route path='/services' Component={Services} />
        </Switch>
        <ContactForm />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
