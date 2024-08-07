import React, { Component } from 'react';

class Footer extends Component {
    state = {  } 
    render() { 
        return (
            <div className="bg-light" id='footer'>
                <footer className="py-3 my-4">
                    <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                        <li className="nav-item"><a href="/" className="nav-link px-2 text-body-secondary">ICT</a></li>
                        <li className="nav-item"><a href="/about" className="nav-link px-2 text-body-secondary">About</a></li>
                        <li className="nav-item"><a href="/contact" className="nav-link px-2 text-body-secondary">Contact</a></li>
                    </ul>
                    <p className="text-center text-body-secondary">© 2024 ICT Uladzislau Danik</p>
                </footer>
            </div>
        );
    }
}
 
export default Footer;