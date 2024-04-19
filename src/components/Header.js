import React, { Component } from 'react';
import 'bootstrap';

function Header({ data }) {
    return (
        <nav class="navbar navbar-expand-lg navbar-dark" id='header'>
            <div class="container-fluid">
                <a class="navbar-brand" href="/">ICT</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link" href="/about">About</a>
                            <div className='link-content'>
                                <ul className='link-content-list'>
                                    <li className='link-content-item'>
                                        <a href='/about#aboutMe'>About Me</a>
                                    </li>
                                    <li className='link-content-item'>
                                        <a href='/about#skills'>Skills</a>
                                    </li>
                                    <li className='link-content-item'>
                                        <a href='/about#experience'>Experience</a>
                                    </li>
                                    <li className='link-content-item'>
                                        <a href='/about#cerificates'>Certificates</a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/projects">Projects</a>
                            <div className='link-content'>
                                <ul className='link-content-list'>
                                    {
                                        data.projects.map(project => 
                                        <li className='link-content-item'>
                                            <a href={'/projects#' + project.projectId}>{project.name}</a>
                                        </li>)
                                    }
                                </ul>
                            </div>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/services">Services</a>
                            <div className='link-content'>
                                <ul className='link-content-list'>
                                    {
                                        data.services.map(service => 
                                        <li className='link-content-item'>
                                            <a href={'/services#' + service.serviceId}>{service.name}</a>
                                        </li>)
                                    }
                                </ul>
                            </div>
                        </li>
                        <li className='nav-item'>
                            <a className='nav-link' href='/contact'>Contact</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
 
export default Header;