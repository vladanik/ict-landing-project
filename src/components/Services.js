import React, { Component } from 'react';

function Services({ data }) {
    return (
        <main>
            <h1 className='page-header'>Services</h1>
            <div id='services' className='secition'>
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
                                <td width='20%' className='service-name'>{s.name}</td>
                                <td width='50%' className='service-description'>{s.description}</td>
                                <td width='25%' className='service-price mobile-hidden'>USD {s.priceFrom} - {s.priceTo}</td>
                                <td width='5%' className='service-contact mobile-hidden'>
                                    <button type="button" class="btn btn-light">Contact</button>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </main>
    );
}
 
export default Services;