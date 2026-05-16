import React from 'react';
import PropTypes from 'prop-types';
import SEO, { getPublicSocialLinks, SITE_URL } from './SEO';
import logoIcon from "../assets/ICT_cmpl_cloud.png";
import multiLing from "../assets/multilingual.png";

function About({ data }) {
    const sameAs = getPublicSocialLinks(data.contact);
    const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Wladyslaw Danik',
        jobTitle: 'Salesforce and Full-Stack Developer',
        knowsAbout: [
            'Salesforce',
            'Apex',
            'Lightning Web Components',
            'Visualforce',
            'React',
            'Java',
            'Spring Boot',
            'SQL',
            'REST APIs',
        ],
        worksFor: {
            '@type': 'Organization',
            name: 'ICT Services',
            url: SITE_URL,
        },
        brand: {
            '@type': 'Brand',
            name: 'ICT Services',
        },
        ...(sameAs.length > 0 ? { sameAs } : {}),
    };

    return (
        <main>
            <SEO
                title='About ICT Services | Salesforce and Full-Stack Developer'
                description='ICT Services is a software development brand led by Wladyslaw Danik, focused on Salesforce, Full-Stack engineering, SQL and API integrations.'
                canonicalPath='/about'
                jsonLd={personSchema}
            />
            <h1 className='page-header'>About ICT Services</h1>

            <section id='about-ict-services' className='section'>
                <h2>Independent Development Service</h2>
                <div className='section-image'>
                    <img src={logoIcon} alt='ICT Services cloud logo' loading='lazy' />
                </div>
                <p>
                    ICT Services is a software development brand led by Wladyslaw Danik. It focuses on practical,
                    maintainable business applications, CRM work and integrations rather than broad generic website
                    production.
                </p>
                <p>
                    The work is based on hands-on commercial experience with Salesforce, Apex, Lightning Web
                    Components, Visualforce, Full-Stack development, SQL and API integrations.
                </p>
            </section>

            <section id='why-work-with-ict-services' className='section'>
                <h2>Why Work With ICT Services?</h2>
                <ul className='trust-list'>
                    <li>Direct communication with the person doing the development work.</li>
                    <li>Practical solutions shaped around real business workflows.</li>
                    <li>Experience across Salesforce, Full-Stack development, SQL and APIs.</li>
                    <li>Focus on readable, maintainable and extendable code.</li>
                </ul>
            </section>

            <section id='about-approach' className='section'>
                <h2>Approach</h2>
                <p>
                    ICT Services favors straightforward architecture, readable implementation and incremental delivery.
                    Each project starts with the business process, then moves toward software that is simple enough to
                    operate and flexible enough to extend later.
                </p>
            </section>

            <section id='communication-languages' className='section'>
                <h2>Communication</h2>
                <div className='section-image'>
                    <img src={multiLing} alt='Polish English and Russian communication illustration' loading='lazy' />
                </div>
                <p>
                    Communication is available in Polish, English and Russian, which helps clarify requirements,
                    document decisions and keep collaboration moving without unnecessary overhead.
                </p>
            </section>
        </main>
    );
}

About.propTypes = {
  data: PropTypes.shape({
    contact: PropTypes.object,
  }).isRequired,
};
 
export default About;
