import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Editsell.css';

const EditSell = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    description: '',
    startingBid: '',
    endTime: '', // Update this line
    category: '',
    imageUrl: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:9002/api/productdescription/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { name, description, startingBid, endTime, category, imageUrl } = response.data;

        // Format the date for the datetime-local input field
        const formattedEndTime = formatDateTime(endTime);

        setProduct({
          name,
          description,
          startingBid,
          endTime: formattedEndTime, // Set the formatted date
          category,
          imageUrl,
        });
      } catch (error) {
        console.error('Error fetching product:', error);
        // Handle error here, e.g., navigate to an error page
      }
    };
    fetchProduct();
  }, [id]);

  const formatDateTime = (dateTimeString) => {
    try {
      const date = new Date(dateTimeString);
      const year = date.getFullYear();
      const month = `${date.getMonth() + 1}`.padStart(2, '0');
      const day = `${date.getDate()}`.padStart(2, '0');
      const hours = `${date.getHours()}`.padStart(2, '0');
      const minutes = `${date.getMinutes()}`.padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:9002/api/modifyBid/${id}`, product, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      window.alert('Changes saved successfully!');
      navigate('/sell');
    } catch (error) {
      console.error('Error editing product:', error);
      // Handle error here, e.g., display an error message to the user
    }
  };

  const handleCancel = () => {
    navigate('/sell');
  };
  
  return (
    <div className="edit-sell-container">
      <h1 className="edit-sell-heading">Edit Product</h1>
      <div className="image-container">
        {product.imageUrl && <img className="current-image" src={product.imageUrl} alt="Product" />}
      </div>
      <div className="form-container">
        <form className="create-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" name="name" id="name" value={product.name} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea id="description" name="description" value={product.description} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="startingBid">Starting Bid:</label>
            <input type="number" id="startingBid" name="startingBid" value={product.startingBid} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="endTime">End Time:</label>
            <input type="datetime-local" id="endTime" name="endTime" value={product.endTime} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="category">Category:</label>
            <select name="category" id="category" value={product.category} onChange={handleChange} required>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home & Garden">Home & Garden</option>
            </select>
          </div>
          <div>
            <label>New Image:</label>
            <input type="file" accept="image/*" id="image" name="image" onChange={(e) => setProduct({ ...product, imageUrl: e.target.files[0] })} />
          </div>
          <button className="b" type="submit">Save Changes</button>
          <button className="b" type="button" onClick={handleCancel}>Cancel</button> {/* Add Cancel button */}
        </form>
      </div>
    </div>
  );
};

export default EditSell;
