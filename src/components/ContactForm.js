import React, { useState } from 'react';
import emailjs from 'emailjs-com';
function ContactForm({ data }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        category: ''
    });
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        var submitButton = document.getElementById('submitButton');
        e.preventDefault();
        submitButton.disabled = true;
        emailjs.sendForm('service_p1k0wj6', 'template_zm7j5yt', e.target, 'Y5iCY22lD0Of2r2Hx')
            .then((result) => {
                setShowModal(true);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: '',
                    category: ''
                });
                submitButton.disabled = false;
                setTimeout(() => {
                    setShowModal(false);
                }, 4000);
            }, (error) => {
                    console.error(error);
                    alert('Send unsuccessfull, please contact Administrator in any way on Contact page:\n' + error.text);
                    submitButton.disabled = false;
            });        
    };

    const closeModal = (e) => {
        e.preventDefault();
        setShowModal(false);
    }

    return (<div className='contact-form-container'>
        <div id='contactForm' className='section'>
            <h2>Contact Us</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <input type='text' name='name' value={formData.name} onChange={handleChange} required placeholder='Name' />
                </label>
                <label>
                    <input type='email' name='email' value={formData.email} onChange={handleChange} required placeholder='Email' />
                </label>
                <label>
                    <input type='tel' name='phone' value={formData.phone} onChange={handleChange} placeholder='Phone (Optional)' />
                </label>
                <label>
                    <textarea name='message' value={formData.message} onChange={handleChange} required placeholder='Type your message...' />
                </label>
                <label>
                    <select name='category' value={formData.category} onChange={handleChange} required>
                        <option value='' key='emptyOption'>Select category...</option>
                        {
                            data.map(category =>
                            <option value={category} key={category.trim() + 'Option'}>{category}</option>)
                        }
                        <option value='Other' key='otherOption'>Other</option>
                    </select>
                </label>
                <button type='submit' id='submitButton' className='btn btn-success'>Submit</button>
            </form>
        </div>

        {showModal && (
        <div class="email-sent-modal" id="emailSentModal">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#00e613" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                        </svg>
                        <p><span>________________</span><span className='line-desktop-only'>____________________________</span></p>
                    </div>
                    <div class="modal-body">
                        <p>Email was sent succesfully!</p>
                        <p>Thank You! We will respond ASAP</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-dark" onClick={closeModal}>Close</button>
                    </div>
                </div>
            </div>
        </div>
        )}
    </div>);
}
 
export default ContactForm;