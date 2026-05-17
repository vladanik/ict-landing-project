import React, {useEffect, useState} from 'react';
import LoadingSpinner from "./LoadingSpinner";
import {LEGAL_DIVIDER} from "../utils/Constant";
import LegalAccordionItem from "./LegalAccordionItem";
import SEO from './SEO';

function Legal() {
    const [legalData, setLegalData] = useState([]);

    useEffect(() => {
        fetch('/legal.txt')
            .then(resp => resp.text())
            .then(text => setLegalData(text.split(LEGAL_DIVIDER)))
            .catch(error => console.error('Error fetching legal data:', error));
    }, []);

    if (!legalData) {
        return <LoadingSpinner fullPage />;
    }

    return (
        <main>
            <SEO
                title='Legal Notices | ICT Services'
                description='Legal notices for ICT Services.'
                canonicalPath='/legal'
            />
            <h1 className='page-header'>Legal Notices</h1>
            <div id='legal' className='section'>
                {legalData.map((section, index) => (
                    <LegalAccordionItem section={section} index={index} key={index} />
                ))}
            </div>
        </main>
    );
}

export default Legal;
