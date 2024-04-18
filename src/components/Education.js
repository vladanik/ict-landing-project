import React, { Component } from 'react';

function Education({ data }) {
    return (
        <div id='education' className='secition'>
            <h2>Education</h2>
            <ul>
                {
                    data.map(eduRecord =>
                    <li>
                        <h4>{eduRecord.universityName} - {eduRecord.country}</h4>
                        <p>{eduRecord.titleName} - {eduRecord.levelName}</p>
                        <p>{eduRecord.dateFrom} - {eduRecord.dateTo}</p>
                    </li>)
                }
            </ul>
        </div>
    );
}
 
export default Education;