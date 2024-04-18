import React, { Component } from 'react';

function Languages({ data }) {
    return (
        <div id='languages' className='secition'>
            <h2>Languages</h2>
            <ul>
                {
                    data.map(lang =>
                    <li>
                        {lang.language} - {lang.level}
                    </li>)
                }
            </ul>
        </div>
    );
}
 
export default Languages;