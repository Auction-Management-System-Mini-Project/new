import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home2.css';

const Home = () => {
  const navigate = useNavigate(); // Get access to the history object

  const handleExplore = () => {
    // Navigate to the signup page
    navigate('/signup');
  };


 return (
    <div className="home-container">
      <div className="overlay">
        <div className="header">
          <h1>Welcome to AuctionEase</h1>
          <p className="tagline">Manage your auctions, bidders, and items with ease</p>
        </div>
        <div className="card-container">
          <div className="card">
            <h3>Easy management of auction events, bidders, and items</h3>
          </div>
          <div className="card">
            <h3>Secure and reliable platform for all your auction needs</h3>
          </div>
          <div className="card">
            <h3>Real-time bidding updates and notifications</h3>
          </div>
          <div className="card">
            <h3>Customizable Auction Settings</h3>
          </div>
        </div>
        <button onClick={handleExplore}className="explore-button"> Let's Explore</button>
      </div>
    </div>
  );
}

export default Home;
