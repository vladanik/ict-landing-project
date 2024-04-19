import React, { Component } from 'react';

function Languages({ data }) {
    return (
        <div id='languages' className='secition'>
            <h4>Languages</h4>
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