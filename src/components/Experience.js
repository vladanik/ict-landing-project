import React, { Component } from 'react';

function Experience({ data }) {
    return (
        <div id='experience' className='secition'>
            <h2>Experience</h2>
            <ul>
            {
                data.map(record => 
                <li>
                    <div>
                        <h4>{record.company}  - {record.country} {record.remote ? '(Remote)' : ''}</h4>
                        <span>{record.dateFrom} - {record.dateTo}</span>
                        <ul>
                            {
                                record.experience.map(expDescription => 
                                <li>
                                    {expDescription}
                                </li>
                                )
                            }
                        </ul>
                    </div>
                </li>)
            }
            </ul>
        </div>
    );
}
 
export default Experience;