import React from 'react';
import { Link } from 'react-router-dom';
import {NOTE_SERVICES_DEMO, NOTE_SERVICES_PRICES} from "../utils/Constant";
import { formatText } from "../utils/Utils";
import SEO from './SEO';

const serviceCategories = [
    {
        id: 'salesforce-development',
        title: 'Salesforce Development',
        description: 'Apex, Lightning Web Components, Visualforce, Flows, CRM customization and platform integrations.',
    },
    {
        id: 'salesforce-b2b-commerce-support',
        title: 'Salesforce B2B Commerce Support',
        description: 'Help with storefront features, order flows, legacy code, integrations and production support.',
    },
    {
        id: 'frontend-development',
        title: 'Frontend Development',
        description: 'Responsive, accessible interfaces for business applications, admin panels and portals.',
    },
    {
        id: 'backend-development',
        title: 'Backend Development',
        description: 'REST APIs, backend services, database integration and business logic.',
    },
    {
        id: 'api-system-integrations',
        title: 'API & System Integrations',
        description: 'Connecting Salesforce, web apps, databases and external services with reliable data flows.',
    },
    {
        id: 'maintenance-refactoring-technical-support',
        title: 'Maintenance, Refactoring & Technical Support',
        description: 'Bug fixing, code cleanup, performance improvements, production support and long-term maintainability.',
    },
];

function Services() {
    return (
        <main>
            <SEO
                title='Salesforce & Full-Stack Development Services | ICT Services'
                description='Development services for Salesforce, Apex, LWC, Frontend, Backend, REST APIs, integrations, maintenance and business applications.'
                canonicalPath='/services'
            />
            <h1 className='page-header'>Services</h1>
            <div id='services' className='section'>
                <div className='note-card'>
                    <p>
                        ICT Services focuses on practical software delivery for business workflows, CRM systems,
                        integrations and internal tools. Work is shaped around maintainable implementation rather than
                        generic web portfolio output.
                    </p>
                </div>

                <div className='services-grid'>
                    {serviceCategories.map((service) => (
                        <article id={service.id} className='service-card' key={service.id}>
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                            <Link className="btn btn-primary" to='/contact#contactForm'>Discuss This Service</Link>
                        </article>
                    ))}
                </div>

                <div className='note-card'>
                    <p>{formatText(NOTE_SERVICES_DEMO)}</p>
                </div>
                <div className='note-card'>
                    <p>{formatText(NOTE_SERVICES_PRICES)}</p>
                </div>
            </div>
        </main>
    );
}

export default Services;
