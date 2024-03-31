import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Products.css'; // Import your CSS file

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products data from backend API
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:9002/api/products'); // Adjust the API endpoint URL
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="products-container">
      <h2 className="products-heading">Products</h2>
      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <img src={product.imageUrl} className="product-image" alt={product.name} />
            <div className="product-details">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-current-bid">Current bid: ${product.currentBid}</p>
              <p className="product-bid-end">Bid ends on: {new Date(product.endTime).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
