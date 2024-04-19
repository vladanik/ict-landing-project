import React, { Component } from 'react';

function Certificates({ data }) {
    return (
        <div id='cerificates' className='secition'>
            <h4>Certificates</h4>
            <ul>
                {
                    data.map(cert =>
                    <li>
                        <h5>{cert.certificationName}</h5>
                        <span>{cert.dateIssued}</span>
                        <p>{cert.description}</p>
                    </li>)
                }
            </ul>
        </div>
    );
}
 
export default Certificates;