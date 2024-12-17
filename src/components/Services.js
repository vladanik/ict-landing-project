import React from 'react';
import {formatText} from "../utils/Utils";
import {NOTE_SERVICES_DEMO, NOTE_SERVICES_PRICES} from "../utils/Constant";

function Services({ data }) {
    return (
        <main>
            <h1 className='page-header'>Services</h1>
            <div id='services' className='section'>
                <div className='section section-warning'>
                    <p dangerouslySetInnerHTML={formatText(NOTE_SERVICES_DEMO)}></p>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>Service</th>
                        <th>Description</th>
                        <th className='service-price mobile-hidden'>Estimated Price</th>
                        <th className='service-contact mobile-hidden'>Contact</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        data.map(s =>
                            <tr id={s.serviceId}>
                                <td width='25%' className='service-name'>{s.name}</td>
                                <td width='45%' className='service-description'>{s.description}</td>
                                <td width='25%' className='service-price mobile-hidden'>
                                    {s.pricing && Object.entries(s.pricing).map(([key, value]) => (
                                        <span>{key + ' ' + value.from + '-' + value.to}<br/></span>
                                    ))}
                                    {!s.pricing && (<span>Individual</span>)}
                                </td>
                                <td width='5%' className='service-contact mobile-hidden'>
                                    <a href='#contactForm'>
                                        <button type="button" className="btn btn-light">Contact</button>
                                    </a>
                                </td>
                            </tr>)
                    }
                    </tbody>
                </table>
                <div className='section section-warning'>
                    <p dangerouslySetInnerHTML={formatText(NOTE_SERVICES_PRICES)}></p>
                </div>
            </div>
        </main>
    );
}

export default Services;