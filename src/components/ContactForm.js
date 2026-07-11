import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import emailjs from 'emailjs-com';
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ADMIN, EMAILJS_PUBLIC_ID } from '../utils/Constant';
import {
  BUDGET_OPTIONS,
  COLLABORATION_OPTIONS,
  CONTACT_FORM_SERVICE_OPTIONS,
  CONTACT_METHOD_OPTIONS,
  TIMELINE_OPTIONS,
  getSubmissionValue,
  getSubmissionValues,
} from '../utils/formOptions';

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
  phone: '',
};

const requiresPhone = (preferredContactMethod) =>
  CONTACT_METHOD_OPTIONS.some(
    (option) => option.id === preferredContactMethod && option.requiresPhone
  );

function PillGroup({
  labelId,
  options,
  selectedValues,
  onToggle,
  labelPrefix,
  multiSelect = false,
  errorId,
  hasError = false,
}) {
  const { t } = useTranslation('contact');

  return (
    <div
      className="pill-group"
      role="group"
      aria-labelledby={labelId}
      aria-describedby={errorId}
      aria-invalid={hasError}
    >
      {options.map((option) => {
        const isSelected = multiSelect
          ? selectedValues.includes(option.id)
          : selectedValues === option.id;

        return (
          <button
            type="button"
            className={`selection-pill${isSelected ? ' is-selected' : ''}`}
            aria-pressed={isSelected}
            onClick={() => onToggle(option.id)}
            key={option.id}
          >
            {t(`${labelPrefix}.${option.id}`)}
          </button>
        );
      })}
    </div>
  );
}

PillGroup.propTypes = {
  labelId: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedValues: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string])
    .isRequired,
  onToggle: PropTypes.func.isRequired,
  labelPrefix: PropTypes.string.isRequired,
  multiSelect: PropTypes.bool,
  errorId: PropTypes.string,
  hasError: PropTypes.bool,
};

function ContactForm() {
  const { t, i18n } = useTranslation('contact');
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('');

  const selectedServicesText = useMemo(
    () => getSubmissionValues(CONTACT_FORM_SERVICE_OPTIONS, formData.selectedServices).join(', '),
    [formData.selectedServices]
  );
  const otherIsSelected = formData.selectedServices.includes('other');
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

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    clearFieldError(name);
  };

  const handleServiceToggle = (serviceId) => {
    setFormData((prevState) => {
      const isSelected = prevState.selectedServices.includes(serviceId);
      const selectedServices = isSelected
        ? prevState.selectedServices.filter((selectedService) => selectedService !== serviceId)
        : [...prevState.selectedServices, serviceId];

      return {
        ...prevState,
        selectedServices,
        otherServiceDetails:
          serviceId === 'other' && isSelected ? '' : prevState.otherServiceDetails,
      };
    });

    clearFieldError('selectedServices');
    if (serviceId === 'other') {
      clearFieldError('otherServiceDetails');
    }
  };

  const handleSingleSelect = (fieldName, value) => {
    const nextValue = formData[fieldName] === value ? '' : value;

    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: nextValue,
    }));

    clearFieldError(fieldName);
    if (fieldName === 'preferredContactMethod' && !requiresPhone(nextValue)) {
      clearFieldError('phone');
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    const trimmedEmail = formData.email.trim();

    if (!formData.name.trim()) {
      nextErrors.name = t('form.validation.nameRequired');
    }

    if (!trimmedEmail) {
      nextErrors.email = t('form.validation.emailRequired');
    } else if (!isValidEmail(trimmedEmail)) {
      nextErrors.email = t('form.validation.emailInvalid');
    }

    if (formData.selectedServices.length === 0) {
      nextErrors.selectedServices = t('form.validation.serviceRequired');
    }

    if (otherIsSelected && !formData.otherServiceDetails.trim()) {
      nextErrors.otherServiceDetails = t('form.validation.otherRequired');
    }

    if (!formData.projectDescription.trim()) {
      nextErrors.projectDescription = t('form.validation.descriptionRequired');
    }

    if (phoneIsRequired && !formData.phone.trim()) {
      nextErrors.phone = t('form.validation.phoneRequired');
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isValidEmail = (email) => {
    const value = String(email || '').trim();

    if (value.length > 254) {
      return false;
    }

    const atIndex = value.indexOf('@');
    const lastAtIndex = value.lastIndexOf('@');

    return atIndex > 0 && atIndex === lastAtIndex && atIndex !== value.length - 1;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage('');
    setStatusType('');

    if (!validateForm()) {
      setStatusType('error');
      setStatusMessage(t('form.validation.formIncomplete'));
      return;
    }

    setIsSubmitting(true);

    emailjs
      .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ADMIN, e.target, EMAILJS_PUBLIC_ID)
      .then(
        () => {
          setStatusType('success');
          setStatusMessage(t('form.status.success'));
          setFormData(initialFormData);
          setErrors({});
          setIsDetailsOpen(false);
          setTimeout(() => {
            setStatusMessage('');
            setStatusType('');
          }, 5000);
        },
        (error) => {
          console.error(error);
          setStatusType('error');
          setStatusMessage(t('form.status.error'));
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="contact-form-container">
      <section id="contactForm" className="section">
        <div className="contact-form-heading">
          <h2>{t('form.title')}</h2>
          <p>{t('form.description')}</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <input type="hidden" name="selectedServices" value={selectedServicesText} />
          <input
            type="hidden"
            name="selectedServicesJson"
            value={JSON.stringify(formData.selectedServices)}
          />
          <input
            type="hidden"
            name="otherServiceDetails"
            value={otherIsSelected ? formData.otherServiceDetails : ''}
          />
          <input type="hidden" name="projectType" value={selectedServicesText} />
          <input type="hidden" name="category" value={selectedServicesText} />
          <input type="hidden" name="message" value={formData.projectDescription} />
          <input
            type="hidden"
            name="contractType"
            value={getSubmissionValue(COLLABORATION_OPTIONS, formData.collaborationType)}
          />
          <input
            type="hidden"
            name="timeline"
            value={getSubmissionValue(TIMELINE_OPTIONS, formData.timeline)}
          />
          <input
            type="hidden"
            name="budgetRange"
            value={getSubmissionValue(BUDGET_OPTIONS, formData.budgetRange)}
          />
          <input
            type="hidden"
            name="preferredContactMethod"
            value={getSubmissionValue(CONTACT_METHOD_OPTIONS, formData.preferredContactMethod)}
          />
          <input type="hidden" name="language" value={i18n.resolvedLanguage} />

          <div className="form-field">
            <label htmlFor="name">{t('form.fields.name.label')}</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder={t('form.fields.name.placeholder')}
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <span className="form-error" id="name-error" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="email">{t('form.fields.email.label')}</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={t('form.fields.email.placeholder')}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <span className="form-error" id="email-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="company">
              {t('form.fields.company.label')} <span>{t('form.optional')}</span>
            </label>
            <input
              id="company"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder={t('form.fields.company.placeholder')}
              autoComplete="organization"
            />
          </div>

          <div className="form-field form-field-spacious">
            <span className="field-label" id="services-label">
              {t('form.fields.services.label')}
            </span>
            <PillGroup
              labelId="services-label"
              options={CONTACT_FORM_SERVICE_OPTIONS}
              selectedValues={formData.selectedServices}
              onToggle={handleServiceToggle}
              labelPrefix="form.options.services"
              multiSelect
              errorId={errors.selectedServices ? 'selected-services-error' : undefined}
              hasError={Boolean(errors.selectedServices)}
            />
            {errors.selectedServices && (
              <span className="form-error" id="selected-services-error" role="alert">
                {errors.selectedServices}
              </span>
            )}
          </div>

          {otherIsSelected && (
            <div className="form-field">
              <label htmlFor="otherServiceDetails">
                {t('form.fields.otherServiceDetails.label')}
              </label>
              <input
                id="otherServiceDetails"
                type="text"
                name="otherServiceDetailsVisible"
                value={formData.otherServiceDetails}
                onChange={(event) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    otherServiceDetails: event.target.value,
                  }));
                  clearFieldError('otherServiceDetails');
                }}
                required
                placeholder={t('form.fields.otherServiceDetails.placeholder')}
                aria-invalid={Boolean(errors.otherServiceDetails)}
                aria-describedby={errors.otherServiceDetails ? 'other-service-error' : undefined}
              />
              {errors.otherServiceDetails && (
                <span className="form-error" id="other-service-error" role="alert">
                  {errors.otherServiceDetails}
                </span>
              )}
            </div>
          )}

          <div className="form-field form-field-spacious project-description-field">
            <label htmlFor="projectDescription">{t('form.fields.projectDescription.label')}</label>
            <textarea
              id="projectDescription"
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleChange}
              required
              placeholder={t('form.fields.projectDescription.placeholder')}
              aria-invalid={Boolean(errors.projectDescription)}
              aria-describedby={errors.projectDescription ? 'project-description-error' : undefined}
            />
            {errors.projectDescription && (
              <span className="form-error" id="project-description-error" role="alert">
                {errors.projectDescription}
              </span>
            )}
          </div>

          <div className="project-details-accordion">
            <button
              type="button"
              className="accordion-toggle"
              aria-expanded={isDetailsOpen}
              aria-controls="additional-project-details"
              onClick={() => setIsDetailsOpen((isOpen) => !isOpen)}
            >
              <span>{t('form.fields.details.toggle')}</span>
              <span aria-hidden="true">{isDetailsOpen ? '-' : '+'}</span>
            </button>

            <div
              id="additional-project-details"
              className="accordion-panel"
              hidden={!isDetailsOpen}
            >
              <div className="form-field">
                <span className="field-label" id="timeline-label">
                  {t('form.fields.timeline.label')} <span>{t('form.optional')}</span>
                </span>
                <PillGroup
                  labelId="timeline-label"
                  options={TIMELINE_OPTIONS}
                  selectedValues={formData.timeline}
                  onToggle={(value) => handleSingleSelect('timeline', value)}
                  labelPrefix="form.options.timeline"
                />
              </div>

              <div className="form-field">
                <span className="field-label" id="collaboration-type-label">
                  {t('form.fields.collaborationType.label')} <span>{t('form.optional')}</span>
                </span>
                <PillGroup
                  labelId="collaboration-type-label"
                  options={COLLABORATION_OPTIONS}
                  selectedValues={formData.collaborationType}
                  onToggle={(value) => handleSingleSelect('collaborationType', value)}
                  labelPrefix="form.options.collaboration"
                />
              </div>

              <div className="form-field">
                <span className="field-label" id="budget-range-label">
                  {t('form.fields.budgetRange.label')} <span>{t('form.optional')}</span>
                </span>
                <PillGroup
                  labelId="budget-range-label"
                  options={BUDGET_OPTIONS}
                  selectedValues={formData.budgetRange}
                  onToggle={(value) => handleSingleSelect('budgetRange', value)}
                  labelPrefix="form.options.budget"
                />
              </div>

              <div className="form-field">
                <span className="field-label" id="preferred-contact-method-label">
                  {t('form.fields.preferredContactMethod.label')} <span>{t('form.optional')}</span>
                </span>
                <PillGroup
                  labelId="preferred-contact-method-label"
                  options={CONTACT_METHOD_OPTIONS}
                  selectedValues={formData.preferredContactMethod}
                  onToggle={(value) => handleSingleSelect('preferredContactMethod', value)}
                  labelPrefix="form.options.contactMethod"
                />
              </div>

              <div className="form-field">
                <label htmlFor="phone">
                  {t('form.fields.phone.label')}{' '}
                  <span>{phoneIsRequired ? t('form.required') : t('form.optional')}</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required={phoneIsRequired}
                  placeholder={t('form.fields.phone.placeholder')}
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && (
                  <span className="form-error" id="phone-error" role="alert">
                    {errors.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {statusMessage && (
            <div className={`form-status ${statusType}`} role="status" aria-live="polite">
              {statusMessage}
            </div>
          )}

          <div className="form-submit-area">
            <button
              type="submit"
              className="btn btn-success contact-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('form.status.sending') : t('form.status.send')}
            </button>
            <p className="form-trust-text">{t('form.trust')}</p>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ContactForm;
