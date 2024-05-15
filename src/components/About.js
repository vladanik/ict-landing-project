import React, { useEffect, useState } from 'react';
import AboutMe from './AboutMe';
import Experience from './Experience';
import Education from './Education';
import Certificates from './Certificates';
import Skills from './Skills';
import Languages from './Languages';
import { useLocation } from 'react-router-dom';
import { sha256 } from 'js-sha256';

function About({ data }) {
    const location = useLocation();
    const [showAccessModal, setShowAccessModal] = useState(false);
    const [formData, setFormData] = useState({
      email: '',
      pass: ''
    });
    const [showRestrictedDetails, setShowRestrictedDetails] = useState(false);
    const [accessGranted, setAccessGranted] = useState(false);

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

    const handleAccessModal = (e) => {
      if (showRestrictedDetails) {
        setShowRestrictedDetails(false);
      } else if (accessGranted) {
        setShowRestrictedDetails(true);
      } else {
        setShowAccessModal(prevState => !prevState);
        let bodyClassList = document.body.classList;
        const restrictedModalOpenClassName = 'restricted-modal-open'
        if (bodyClassList.contains(restrictedModalOpenClassName)) {
          bodyClassList.remove(restrictedModalOpenClassName);
        } else {
          bodyClassList.add(restrictedModalOpenClassName);
        }
        emptyFormData();
      }
    }

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
      document.getElementById('restrictedDetailsIncorrectDataText').classList.add('hidden');
    }

    const handleSubmit = (e) => {
      document.getElementById('restrictedDetailsIncorrectDataText').classList.add('hidden');
      var submitButton = document.getElementById('accessSubmitButton');
      e.preventDefault();
      submitButton.disabled = true;
      const dataAccess = data.dataAccess.filter(
        data => data.email === formData.email && data.pass === hashPass(formData.pass)
      );
      if (dataAccess.length) {
        closeAccessPopupShowData();
        setAccessGranted(true);
      } else {
        showIncorrectDataError();
        submitButton.disabled = false;
      }
      emptyFormData();
    }

    const emptyFormData = () => {
      setFormData({
        email: '',
        pass: ''
      });
    }

    const closeAccessPopupShowData = () => {
      setShowRestrictedDetails(true);
      handleAccessModal();
    }

    const showIncorrectDataError = () => {
      document.getElementById('restrictedDetailsIncorrectDataText').classList.remove('hidden');
    }

    const hashPass = (pass) => {
      return sha256(pass);
    }

    return (<>
        <main>
            {showAccessModal && <div className='restricted-modal-overlay' />}
            <h1 className='page-header'>ICT Uladzislau Danik</h1>
            <AboutMe data={data.aboutMe} />
            <div id='skillsLanguagesEducation'>
                <Skills data={data.skills} />
                {showRestrictedDetails && (<>
                  <Languages data={data.languages} />
                  <Education data={data.education} />
                </>)}
            </div>
            {showRestrictedDetails && (
              <div id='experienceCertificates'>
                <Experience data={data.experience} />
                <Certificates data={data.certificates} />
              </div>
            )}
            <button className='restricted-details-button btn btn-dark' onClick={handleAccessModal}><span>{showRestrictedDetails ? 'Hide Details' : 'Show More Details'}</span></button>
        </main>

        {showAccessModal && (
          <div className='resticted-details-modal' id='restrictedDetailsModal' tabIndex='-1'>
            <div className='modal-dialog' role='document'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <p>Enter your email and password to access more details</p>
                  <button type='button' className='btn btn-dark' onClick={handleAccessModal} title='Close'>&#10005;</button>
                </div>
                <div className='modal-body'>
                  <form onSubmit={handleSubmit}>
                    <input type='email' name='email' value={formData.email} onChange={handleChange} required placeholder='Email' />
                    <input type='password' name='pass' value={formData.pass} onChange={handleChange} required placeholder='Password' />
                    <p className='restricted-details-incorrect-data hidden' id='restrictedDetailsIncorrectDataText'>
                      Wrong email or password provided. If you want to access the details, please reach out to me via Contact Form below choosing category "Access Request".
                    </p>
                    <button type='submit' id='accessSubmitButton' className='btn btn-success'>Submit</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
    </>);
}
 
export default About;