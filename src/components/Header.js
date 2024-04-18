import React, { Component } from 'react';
import 'bootstrap';

class Header extends Component {
    state = {  } 
    render() { 
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
                                <a class="nav-link" href="#aboutMe">About</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#experience">Experience</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#projects">Projects</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#skills">Skills</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#education">Education</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#languages">Languages</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#certificates">Certificates</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#services">Services</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
 
export default Header;