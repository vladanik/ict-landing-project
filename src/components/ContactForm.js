import React, { useState } from 'react';
import PropTypes from 'prop-types';
import emailjs from 'emailjs-com';
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ADMIN, EMAILJS_PUBLIC_ID } from '../utils/Constant';

function ContactForm({ data }) {
    const [formData, setFormData] = useState({
        caller: '',
        name: '',
        email: '',
        phone: '',
        message: '',
        category: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMessage('');
        setStatusType('');

        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ADMIN, e.target, EMAILJS_PUBLIC_ID)
            .then(() => {
                setStatusType('success');
                setStatusMessage('Email was sent successfully. Thank you, We will respond as soon as possible.');
                setFormData({
                    caller: '',
                    name: '',
                    email: '',
                    phone: '',
                    message: '',
                    category: ''
                });
                setTimeout(() => {
                    setStatusMessage('');
                    setStatusType('');
                }, 5000);
            }, (error) => {
                console.error(error);
                setStatusType('error');
                setStatusMessage('Send unsuccessful. Please use one of the contact methods above or try again later.');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div className='contact-form-container'>
            <section id='contactForm' className='section'>
                <h2>Contact Us</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor='caller'>Who are you?</label>
                    <select id='caller' name='caller' value={formData.caller} onChange={handleChange} required>
                        <option value='' key='emptyOption'>Select caller type...</option>
                        {data.callerTypes.map((type) => (
                            <option value={type} key={type.trim() + 'Option'}>{type}</option>
                        ))}
                    </select>

                    <label htmlFor='name'>Name</label>
                    <input id='name' type='text' name='name' value={formData.name} onChange={handleChange} required placeholder='Your name' autoComplete='name' />

                    <label htmlFor='email'>Email</label>
                    <input id='email' type='email' name='email' value={formData.email} onChange={handleChange} required placeholder='you@example.com' autoComplete='email' />

                    <label htmlFor='phone'>Phone <span>(optional)</span></label>
                    <input id='phone' type='tel' name='phone' value={formData.phone} onChange={handleChange} placeholder='Phone number' autoComplete='tel' />

                    <label htmlFor='message'>Message</label>
                    <textarea id='message' name='message' value={formData.message} onChange={handleChange} required minLength='10' placeholder='Tell me what you would like to build or improve.' />

                    <label htmlFor='category'>Category</label>
                    <select id='category' name='category' value={formData.category} onChange={handleChange} required>
                        <option value='' key='emptyOption'>Select category...</option>
                        {data.contactCategories.map(category =>
                            <option value={category} key={category.trim() + 'Option'}>{category}</option>
                        )}
                        <option value='Other' key='otherOption'>Other</option>
                    </select>

                    {statusMessage && (
                        <div className={`form-status ${statusType}`} role='status' aria-live='polite'>
                            {statusMessage}
                        </div>
                    )}

                    <button type='submit' className='btn btn-success' disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Submit'}
                    </button>
                </form>
            </section>
        </div>
    );
}

ContactForm.propTypes = {
  data: PropTypes.shape({
    callerTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    contactCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default ContactForm;
