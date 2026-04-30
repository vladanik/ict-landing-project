import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
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

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]);

  return null;
}

function AppContent({ data }) {
  const location = useLocation();
  const hideContactForm = location.pathname === '/legal';

  return (
    <div className='App'>
      <ScrollToHash />
      <Header />

      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/about' element={<About data={data} />} />
        <Route path='/projects' element={<Projects data={data.projects} />} />
        <Route path='/services' element={<Services data={data.services} />} />
        <Route path='/contact' element={<Contact data={data.contact} />} />
        <Route path='/legal' element={<Legal />} />
      </Routes>

      {!hideContactForm && <ContactForm data={data.contactCategories} />}
      <Footer />
    </div>
  );
}

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.json');
        const jsonData = await response.json();
        setData(jsonData.data || jsonData);
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
      <AppContent data={data} />
      <Analytics />
    </Router>
  );
}

export default App;
