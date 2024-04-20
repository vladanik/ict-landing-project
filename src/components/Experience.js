import React from 'react';

function Experience({ data }) {
    return (
        <div id='experience' className='secition'>
            <h4>Experience</h4>
            <ul>
            {
                data.map(record => 
                <li>
                    <div>
                        <h5>{record.company}  - {record.country} {record.remote ? '(Remote)' : ''}</h5>
                        <h6>{record.position}</h6>
                        <span>{record.dateFrom} - {record.dateTo}</span>
                        <ul className='experience-inner-list'>
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