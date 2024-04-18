import React, { Component } from 'react';

function Services({ data }) {
    return (
        <div id='services' className='secition'>
            <h2>Services</h2>
            <table>
                <thead>
                    <tr>
                        <th>Service</th>
                        <th>Description</th>
                        <th>Estimated Price</th>
                        <th>Contact</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map(s =>
                        <tr>
                            <td width='20%'>{s.name}</td>
                            <td width='50%'>{s.description}</td>
                            <td width='25%' className='service-price'>USD {s.priceFrom} - {s.priceTo}</td>
                            <td width='5%'>
                                <button type="button" class="btn btn-light">Contact</button>
                            </td>
                        </tr>)
                    }
                </tbody>
            </table>
        </div>
    );
}
 
export default Services;