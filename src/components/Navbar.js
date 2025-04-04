import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsMenuOpen(false); // Close the menu when a link is clicked
    };

    return (
        <nav className="navbar">
            <div className="navbar-title" onClick={() => handleNavigation('/')}>
                BakingAI
            </div>

            <div className="menu-icon" onClick={toggleMenu}>
                <span className={`bar ${isMenuOpen ? 'open' : ''}`} />
                <span className={`bar ${isMenuOpen ? 'open' : ''}`} />
                <span className={`bar ${isMenuOpen ? 'open' : ''}`} />
            </div>

            <div className={`navbar-buttons ${isMenuOpen ? 'show' : ''}`}>
                <button className="nav-btn" onClick={() => handleNavigation('/recipes')}>
                    Discover Recipes
                </button>
                <button className="nav-btn" onClick={() => handleNavigation('/contact')}>
                    Contact Us
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
