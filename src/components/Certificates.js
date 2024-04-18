import React, { Component } from 'react';

function Certificates({ data }) {
    return (
        <div id='cerificates' className='secition'>
            <h2>Certificates</h2>
            <ul>
                {
                    data.map(cert =>
                    <li>
                        <h4>{cert.certificationName}</h4>
                        <span>{cert.dateIssued}</span>
                        <p>{cert.description}</p>
                    </li>)
                }
            </ul>
        </div>
    );
}
 
export default Certificates;