import React, { Component } from 'react';

class Footer extends Component {
    state = {  } 
    render() { 
        return (
            <div class="bg-light" id='footer'>
                <footer class="py-3 my-4">
                    <ul class="nav justify-content-center border-bottom pb-3 mb-3">
                        <li class="nav-item"><a href="/" class="nav-link px-2 text-body-secondary">ICT</a></li>
                        <li class="nav-item"><a href="/about" class="nav-link px-2 text-body-secondary">About</a></li>
                        <li class="nav-item"><a href="/contact" class="nav-link px-2 text-body-secondary">Contact</a></li>
                    </ul>
                    <p class="text-center text-body-secondary">© 2024 ICT Uladzislau Danik</p>
                </footer>
            </div>
        );
    }
}
 
export default Footer;