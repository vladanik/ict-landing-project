import React from 'react';
import 'bootstrap';
import logoWhite from '../assets/logo-w-text-white.png';

function Header({ data }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" id='header'>
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    <img src={logoWhite} alt="Logo" width="75" className="d-inline-block align-top mb-2" />
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item" key='about'>
                            <a className="nav-link" href="/about">About</a>
                        </li>
                        <li className="nav-item" key='projects'>
                            <a className="nav-link" href="/projects">Projects</a>
                            <div className='link-content'>
                                <ul className='link-content-list'>
                                    {
                                        data.projects.map(project => 
                                        <li className='link-content-item' key={project.projectId}>
                                            <a href={'/projects#' + project.projectId}>{project.name}</a>
                                        </li>)
                                    }
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item" key='services'>
                            <a className="nav-link" href="/services">Services</a>
                            <div className='link-content'>
                                <ul className='link-content-list'>
                                    {
                                        data.services.map(service => 
                                        <li className='link-content-item' key={service.serviceId}>
                                            <a href={'/services#' + service.serviceId}>{service.name}</a>
                                        </li>)
                                    }
                                </ul>
                            </div>
                        </li>
                        <li className='nav-item' key='contact'>
                            <a className='nav-link' href='/contact'>Contact</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
 
export default Header;