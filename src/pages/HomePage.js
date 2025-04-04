import React from 'react';
import './Homepage.css';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Homepage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Close the menu when a link is clicked
  };

  return (
    <div className="homepage">
      <main className="main">
        <div className="content-box">
          {/* <a href="#" className="learn-more">
            Discover our new AI-powered recipe generator.
            <span> Learn more →</span>
          </a> */}
          <h1>Generate Delicious Recipes with Your Ingredients</h1>
          <p>
            Simply input your available ingredients, select dietary preferences, and let our AI create unique and delicious recipes just for you.
          </p>
          <button onClick={() => handleNavigation('/recipes')} >Get started</button>
        </div>
      </main>
    </div>
  );
}

export default Homepage;
