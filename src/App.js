import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes as Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import About from './components/About';
import Projects from './components/Projects';
import ContactForm from './components/ContactForm';
import Services from './components/Services';
import Contact from './components/Contact';
import Legal from "./components/Legal";
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

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
    <Router>
      <div className='App'>
        <Header />

        <Switch>
          <Route exact path='/' Component={() => <HomePage />} />
          <Route path='/about' Component={() => <About data={data} />} />
          <Route path='/projects' Component={() => <Projects data={data.projects} />} />
          <Route path='/services' Component={() => <Services data={data.services} />} />
          <Route path='/contact' Component={() => <Contact data={data.contact} />} />
          <Route path='/legal' Component={() => <Legal />} />
        </Switch>

        <ContactForm data={data.contactCategories} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
