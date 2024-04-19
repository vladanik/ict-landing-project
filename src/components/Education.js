import React, { Component } from 'react';

function Education({ data }) {
    return (
        <div id='education' className='secition'>
            <h4>Education</h4>
            <ul>
                {
                    data.map(eduRecord =>
                    <li>
                        <h5>{eduRecord.universityName} - {eduRecord.country}</h5>
                        <p>{eduRecord.titleName} - {eduRecord.levelName}</p>
                        <p>{eduRecord.dateFrom} - {eduRecord.dateTo}</p>
                    </li>)
                }
            </ul>
        </div>
    );
}
 
export default Education;