import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../Home.css';
import SEO, { getPublicSocialLinks, SITE_URL } from './SEO';

const whoWeWorkWith = [
    'Salesforce partners and B2B commerce teams',
    'Small businesses modernizing internal systems',
    'Companies needing long-term maintenance and support',
    'Teams building dashboards, portals and internal tools',
];

const technologyGroups = [
    {
        name: 'Salesforce',
        items: ['Apex', 'Lightning', 'LWC', 'Visualforce', 'Flows', 'SOQL', 'REST integrations'],
    },
    {
        name: 'Frontend',
        items: ['React', 'React Native', 'Next.js', 'JavaScript', 'TypeScript', 'responsive UI', 'accessibility'],
    },
    {
        name: 'Backend',
        items: ['Python', 'Java', 'Spring Boot', 'SQL', 'PostgreSQL', 'REST API'],
    },
    {
        name: 'Delivery',
        items: ['Git', 'code review', 'maintainability', 'documentation'],
    },
];

function HomePage ({ contact }) {
    const sameAs = getPublicSocialLinks(contact);
    const professionalServiceSchema = {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'ICT Services',
        founder: {
            '@type': 'Person',
            name: 'Wladyslaw Danik',
        },
        serviceType: [
            'Salesforce development',
            'Frontend development',
            'Backend development',
            'API integrations',
        ],
        url: SITE_URL,
        areaServed: ['Poland', 'European Union', 'Remote'],
        ...(sameAs.length > 0 ? { sameAs } : {}),
    };

    return (
        <main>
            <SEO
                title='Salesforce & Full-Stack Development | ICT Services'
                description='ICT Services provides Salesforce development, frontend applications, backend systems, and API integrations for practical business systems.'
                canonicalPath='/'
                jsonLd={professionalServiceSchema}
            />
            <section className='home-container site-container' aria-labelledby='home-title'>
                <h1 id='home-title'>Salesforce &amp; Full-Stack Development for Business Applications</h1>
                <p className='home-subheadline'>Apex, Lightning Web Components, frontend applications, backend systems and API integrations for practical, maintainable business software.</p>
                <p className='home-value-prop'>
                    ICT Services provides Salesforce and Full-Stack development, API integrations and maintainable business software focused on real operational workflows.
                </p>
                <div className='home-actions'>
                    <Link className='btn btn-primary' to='/services'>View Services</Link>
                    <Link className='btn btn-outline-light' to='/contact'>Discuss Your Project</Link>
                </div>
                <Link className='home-secondary-link' to='/about'>About ICT Services</Link>
            </section>

            <section className='section home-info-section' aria-labelledby='who-we-work-with'>
                <h2 id='who-we-work-with'>Who We Work With</h2>
                <div className='home-list-grid'>
                    {whoWeWorkWith.map((item) => (
                        <article className='home-info-card' key={item}>
                            <h3>{item}</h3>
                        </article>
                    ))}
                </div>
            </section>

            <section className='section home-info-section' aria-labelledby='technologies'>
                <h2 id='technologies'>Technologies</h2>
                <div className='technology-grid'>
                    {technologyGroups.map((group) => (
                        <article className='home-info-card' key={group.name}>
                            <h3>{group.name}</h3>
                            <ul className='tech-stack'>
                                {group.items.map((item) => <li key={item}>{item}</li>)}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}

HomePage.propTypes = {
    contact: PropTypes.object,
};

HomePage.defaultProps = {
    contact: {},
};
 
export default HomePage;
