import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Homepage.css';

function Homepage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/recipes');
  };

  return (
    <div className="homepage-container d-flex justify-content-center align-items-center">
      <div className="container text-center p-5">
        {/* Set all text to yellow by applying 'animated-text' class */}
        <h3 className="homepage-heading animated-text">
        🧑‍🍳 Accurate Recipes with Precise Gram Measurements!

        </h3>
        <p className="lead animated-text mb-4">
        No more guessing! Say goodbye to confusing cup-to-gram conversions.
🥄➡️⚖️ Our AI-powered recipes already include precise gram measurements for every ingredient!
👨‍🍳 Just select your ingredients, and let our smart system find the perfect, deliciously accurate recipe for you!

🎯 Bake with confidence, cook with precision!        </p>
        <button 
          onClick={handleGetStarted} 
          className="btn btn-primary btn-lg animated-btn"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Homepage;