import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="homepage">
      <div className="content">
        <div className="text-container">
          <h1 className="home-heading">Welcome to AuctionEase</h1>
          <p className="tagline">Manage your auctions, bidders, and items with ease</p>
        </div>
  
        <div className="buttons">
          <button className="home-link" onClick={() => { window.location.href = "/productdisplay"; }}>
            Products
          </button>
          <button className="home-link" onClick={() => { window.location.href = "/sell"; }}>
            Sell
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
