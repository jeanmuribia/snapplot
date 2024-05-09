import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation(); 
    return (
        <nav>
            <div>Current Page: {location.pathname}</div> 
            <ul>
                <li>
                    <NavLink to="/dashboard" activeclassname="active">
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/user-settings" activeclassname="active">
                        User Settings
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;