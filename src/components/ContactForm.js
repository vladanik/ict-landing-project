import React, { useState } from 'react';
import PropTypes from 'prop-types';
import emailjs from 'emailjs-com';
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ADMIN, EMAILJS_PUBLIC_ID } from '../utils/Constant';

const SERVICE_OPTIONS = [
    'Salesforce Development',
    'Salesforce B2B Commerce',
    'Frontend Development',
    'Backend Development',
    'API Integrations',
    'Technical Support',
    'Website Development',
    'AI / Automation',
    'Other'
];

const TIMELINE_OPTIONS = [
    'ASAP',
    'Within 1 month',
    '1–3 months',
    'Flexible / planning stage'
];

const COLLABORATION_OPTIONS = [
    'One-time project',
    'Long-term collaboration',
    'Maintenance & support',
    'Not sure yet'
];

const BUDGET_OPTIONS = [
    'Under €1k',
    '€1k–5k',
    '€5k–15k',
    '€15k+',
    'Not sure yet'
];

const CONTACT_METHOD_OPTIONS = [
    'Email',
    'Phone',
    'Video call'
];

const initialFormData = {
    name: '',
    email: '',
    company: '',
    selectedServices: [],
    otherServiceDetails: '',
    projectDescription: '',
    timeline: '',
    collaborationType: '',
    budgetRange: '',
    preferredContactMethod: '',
    phone: ''
};

const requiresPhone = (preferredContactMethod) => (
    preferredContactMethod === 'Phone' || preferredContactMethod === 'Video call'
);

function PillGroup({ labelId, options, selectedValues, onToggle, multiSelect = false, errorId, hasError = false }) {
    return (
        <div
            className='pill-group'
            role='group'
            aria-labelledby={labelId}
            aria-describedby={errorId}
            aria-invalid={hasError}
        >
            {options.map((option) => {
                const isSelected = multiSelect
                    ? selectedValues.includes(option)
                    : selectedValues === option;

                return (
                    <button
                        type='button'
                        className={`selection-pill${isSelected ? ' is-selected' : ''}`}
                        aria-pressed={isSelected}
                        onClick={() => onToggle(option)}
                        key={option}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
    );
}

PillGroup.propTypes = {
    labelId: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedValues: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.string
    ]).isRequired,
    onToggle: PropTypes.func.isRequired,
    multiSelect: PropTypes.bool,
    errorId: PropTypes.string,
    hasError: PropTypes.bool
};

function ContactForm() {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState('');

    const selectedServicesText = formData.selectedServices.join(', ');
    const otherIsSelected = formData.selectedServices.includes('Other');
    const phoneIsRequired = requiresPhone(formData.preferredContactMethod);

    const clearFieldError = (fieldName) => {
        setErrors((prevErrors) => {
            if (!prevErrors[fieldName]) {
                return prevErrors;
            }

            const updatedErrors = { ...prevErrors };
            delete updatedErrors[fieldName];
            return updatedErrors;
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        clearFieldError(name);
    };

    const handleServiceToggle = (service) => {
        setFormData((prevState) => {
            const isSelected = prevState.selectedServices.includes(service);
            const selectedServices = isSelected
                ? prevState.selectedServices.filter((selectedService) => selectedService !== service)
                : [...prevState.selectedServices, service];

            return {
                ...prevState,
                selectedServices,
                otherServiceDetails: service === 'Other' && isSelected ? '' : prevState.otherServiceDetails
            };
        });

        clearFieldError('selectedServices');
        if (service === 'Other') {
            clearFieldError('otherServiceDetails');
        }
    };

    const handleSingleSelect = (fieldName, value) => {
        const nextValue = formData[fieldName] === value ? '' : value;

        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: nextValue
        }));

        clearFieldError(fieldName);
        if (fieldName === 'preferredContactMethod' && !requiresPhone(nextValue)) {
            clearFieldError('phone');
        }
    };

    const validateForm = () => {
        const nextErrors = {};
        const trimmedEmail = formData.email.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) {
            nextErrors.name = 'Name is required.';
        }

        if (!trimmedEmail) {
            nextErrors.email = 'Email is required.';
        } else if (!emailPattern.test(trimmedEmail)) {
            nextErrors.email = 'Enter a valid email address.';
        }

        if (formData.selectedServices.length === 0) {
            nextErrors.selectedServices = 'Select at least one service.';
        }

        if (otherIsSelected && !formData.otherServiceDetails.trim()) {
            nextErrors.otherServiceDetails = 'Please describe the service you need.';
        }

        if (!formData.projectDescription.trim()) {
            nextErrors.projectDescription = 'Project description is required.';
        }

        if (phoneIsRequired && !formData.phone.trim()) {
            nextErrors.phone = 'Phone number is required for this contact method.';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatusMessage('');
        setStatusType('');

        if (!validateForm()) {
            setStatusType('error');
            setStatusMessage('Please complete the required fields before sending.');
            return;
        }

        setIsSubmitting(true);

        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ADMIN, e.target, EMAILJS_PUBLIC_ID)
            .then(() => {
                setStatusType('success');
                setStatusMessage('Email was sent successfully. Thank you, we will respond as soon as possible.');
                setFormData(initialFormData);
                setErrors({});
                setIsDetailsOpen(false);
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
                <div className='contact-form-heading'>
                    <h2>Send Project Request</h2>
                    <p>Briefly describe what you need. No technical specification required.</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <input type='hidden' name='selectedServices' value={selectedServicesText} />
                    <input type='hidden' name='selectedServicesJson' value={JSON.stringify(formData.selectedServices)} />
                    <input type='hidden' name='otherServiceDetails' value={otherIsSelected ? formData.otherServiceDetails : ''} />
                    <input type='hidden' name='projectType' value={selectedServicesText} />
                    <input type='hidden' name='category' value={selectedServicesText} />
                    <input type='hidden' name='message' value={formData.projectDescription} />
                    <input type='hidden' name='contractType' value={formData.collaborationType} />

                    <div className='form-field'>
                        <label htmlFor='name'>Name</label>
                        <input
                            id='name'
                            type='text'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder='Your name'
                            autoComplete='name'
                            aria-invalid={Boolean(errors.name)}
                            aria-describedby={errors.name ? 'name-error' : undefined}
                        />
                        {errors.name && <span className='form-error' id='name-error' role='alert'>{errors.name}</span>}
                    </div>

                    <div className='form-field'>
                        <label htmlFor='email'>Email</label>
                        <input
                            id='email'
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder='you@company.com'
                            autoComplete='email'
                            aria-invalid={Boolean(errors.email)}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                        {errors.email && <span className='form-error' id='email-error' role='alert'>{errors.email}</span>}
                    </div>

                    <div className='form-field'>
                        <label htmlFor='company'>Company / Organization <span>(optional)</span></label>
                        <input
                            id='company'
                            type='text'
                            name='company'
                            value={formData.company}
                            onChange={handleChange}
                            placeholder='Company, startup or organization'
                            autoComplete='organization'
                        />
                    </div>

                    <div className='form-field form-field-spacious'>
                        <span className='field-label' id='services-label'>What do you need help with?</span>
                        <PillGroup
                            labelId='services-label'
                            options={SERVICE_OPTIONS}
                            selectedValues={formData.selectedServices}
                            onToggle={handleServiceToggle}
                            multiSelect
                            errorId={errors.selectedServices ? 'selected-services-error' : undefined}
                            hasError={Boolean(errors.selectedServices)}
                        />
                        {errors.selectedServices && <span className='form-error' id='selected-services-error' role='alert'>{errors.selectedServices}</span>}
                    </div>

                    {otherIsSelected && (
                        <div className='form-field'>
                            <label htmlFor='otherServiceDetails'>Please specify</label>
                            <input
                                id='otherServiceDetails'
                                type='text'
                                name='otherServiceDetailsVisible'
                                value={formData.otherServiceDetails}
                                onChange={(event) => {
                                    setFormData((prevState) => ({
                                        ...prevState,
                                        otherServiceDetails: event.target.value
                                    }));
                                    clearFieldError('otherServiceDetails');
                                }}
                                required
                                placeholder='Describe the service you need'
                                aria-invalid={Boolean(errors.otherServiceDetails)}
                                aria-describedby={errors.otherServiceDetails ? 'other-service-error' : undefined}
                            />
                            {errors.otherServiceDetails && <span className='form-error' id='other-service-error' role='alert'>{errors.otherServiceDetails}</span>}
                        </div>
                    )}

                    <div className='form-field form-field-spacious project-description-field'>
                        <label htmlFor='projectDescription'>Project description</label>
                        <textarea
                            id='projectDescription'
                            name='projectDescription'
                            value={formData.projectDescription}
                            onChange={handleChange}
                            required
                            placeholder='Briefly describe your idea, problem, or what you would like to build.'
                            aria-invalid={Boolean(errors.projectDescription)}
                            aria-describedby={errors.projectDescription ? 'project-description-error' : undefined}
                        />
                        {errors.projectDescription && <span className='form-error' id='project-description-error' role='alert'>{errors.projectDescription}</span>}
                    </div>

                    <div className='project-details-accordion'>
                        <button
                            type='button'
                            className='accordion-toggle'
                            aria-expanded={isDetailsOpen}
                            aria-controls='additional-project-details'
                            onClick={() => setIsDetailsOpen((isOpen) => !isOpen)}
                        >
                            <span>Additional project details (optional)</span>
                            <span aria-hidden='true'>{isDetailsOpen ? '-' : '+'}</span>
                        </button>

                        <div
                            id='additional-project-details'
                            className='accordion-panel'
                            hidden={!isDetailsOpen}
                        >
                            <div className='form-field'>
                                <span className='field-label' id='timeline-label'>Timeline <span>(optional)</span></span>
                                <PillGroup
                                    labelId='timeline-label'
                                    options={TIMELINE_OPTIONS}
                                    selectedValues={formData.timeline}
                                    onToggle={(value) => handleSingleSelect('timeline', value)}
                                />
                                <input type='hidden' name='timeline' value={formData.timeline} />
                            </div>

                            <div className='form-field'>
                                <span className='field-label' id='collaboration-type-label'>Collaboration type <span>(optional)</span></span>
                                <PillGroup
                                    labelId='collaboration-type-label'
                                    options={COLLABORATION_OPTIONS}
                                    selectedValues={formData.collaborationType}
                                    onToggle={(value) => handleSingleSelect('collaborationType', value)}
                                />
                                <input type='hidden' name='collaborationType' value={formData.collaborationType} />
                            </div>

                            <div className='form-field'>
                                <span className='field-label' id='budget-range-label'>Budget range <span>(optional)</span></span>
                                <PillGroup
                                    labelId='budget-range-label'
                                    options={BUDGET_OPTIONS}
                                    selectedValues={formData.budgetRange}
                                    onToggle={(value) => handleSingleSelect('budgetRange', value)}
                                />
                                <input type='hidden' name='budgetRange' value={formData.budgetRange} />
                            </div>

                            <div className='form-field'>
                                <span className='field-label' id='preferred-contact-method-label'>Preferred contact method <span>(optional)</span></span>
                                <PillGroup
                                    labelId='preferred-contact-method-label'
                                    options={CONTACT_METHOD_OPTIONS}
                                    selectedValues={formData.preferredContactMethod}
                                    onToggle={(value) => handleSingleSelect('preferredContactMethod', value)}
                                />
                                <input type='hidden' name='preferredContactMethod' value={formData.preferredContactMethod} />
                            </div>

                            <div className='form-field'>
                                <label htmlFor='phone'>Phone <span>{phoneIsRequired ? '(required)' : '(optional)'}</span></label>
                                <input
                                    id='phone'
                                    type='tel'
                                    name='phone'
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required={phoneIsRequired}
                                    placeholder='Phone number'
                                    autoComplete='tel'
                                    aria-invalid={Boolean(errors.phone)}
                                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                                />
                                {errors.phone && <span className='form-error' id='phone-error' role='alert'>{errors.phone}</span>}
                            </div>
                        </div>
                    </div>

                    {statusMessage && (
                        <div className={`form-status ${statusType}`} role='status' aria-live='polite'>
                            {statusMessage}
                        </div>
                    )}

                    <div className='form-submit-area'>
                        <button type='submit' className='btn btn-success contact-submit-button' disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Send Request'}
                        </button>
                        <p className='form-trust-text'>Usually responding within 24 hours.</p>
                    </div>
                </form>
            </section>
        </div>
    );
}

ContactForm.propTypes = {
  data: PropTypes.shape({
    callerTypes: PropTypes.arrayOf(PropTypes.string),
    contactCategories: PropTypes.arrayOf(PropTypes.string),
  }),
};

ContactForm.defaultProps = {
    data: {}
};

export default ContactForm;
