import React from 'react';
import PropTypes from 'prop-types';
import { FaEnvelope, FaGithub, FaLinkedin, FaTelegramPlane } from 'react-icons/fa';

function Contact({ data }) {
    const methods = [
        { key: 'github', label: 'GitHub', icon: <FaGithub aria-hidden='true' /> },
        { key: 'linkedin', label: 'LinkedIn', icon: <FaLinkedin aria-hidden='true' /> },
        { key: 'telegram', label: 'Telegram', icon: <FaTelegramPlane aria-hidden='true' /> },
        { key: 'email', label: 'Email', icon: <FaEnvelope aria-hidden='true' /> },
    ];

    return (
        <main>
            <h1 className='page-header'>Contact</h1>
            <section id='contact' className='section'>
                <div className='contact-list'>
                    {methods.map(method => {
                        const item = data[method.key];

                        return (
                            <a
                                className='contact-method'
                                href={item.link}
                                target={method.key === 'email' ? undefined : '_blank'}
                                rel={method.key === 'email' ? undefined : 'noreferrer'}
                                key={method.key}
                            >
                                <span className='contact-icon'>{method.icon}</span>
                                <span>
                                    <strong>{method.label}</strong>
                                    <span>{item.name}</span>
                                </span>
                            </a>
                        );
                    })}
                </div>
                <p className='contact-form-note'>Or use the form below.</p>
            </section>
        </main>
    );
}

Contact.propTypes = {
  data: PropTypes.shape({
    github: PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }).isRequired,
    linkedin: PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }).isRequired,
    telegram: PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }).isRequired,
    email: PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Contact;
