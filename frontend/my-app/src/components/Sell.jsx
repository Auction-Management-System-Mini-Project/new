// Sell.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Sell.css';

const Sell = () => {
    const [products, setProducts] = useState([]);
  
    useEffect(() => {
      // Fetch products data from backend API
      const fetchProducts = async () => {
        try {
          const response = await axios.get('http://localhost:9002/api/products');
          setProducts(response.data);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
  
      fetchProducts();
    }, []);

  const handleEdit = (productId) => {
    // Handle edit action for the product with productId
    console.log(`Editing product with ID ${productId}`);
  };

  const handleDelete = (productId) => {
    // Handle delete action for the product with productId
    console.log(`Deleting product with ID ${productId}`);
  };

  return (
    <div className="sell-container">
      <h2 className="sell-heading">Listed Auctions</h2>
      <div className="products-list">
      <p><Link to="/create">Create a product</Link></p>
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>Description: {product.description}</p>
            <p>Starting Bid: {product.startingBid}</p>
            <p>Current Bid: {product.currentBid}</p>
            <p>End Time: {product.endTime}</p>
            <p>User ID: {product.userId}</p>
            
            <div className="action-buttons">
              <button onClick={() => handleEdit(product.id)}>Edit</button>
              <button onClick={() => handleDelete(product.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sell;