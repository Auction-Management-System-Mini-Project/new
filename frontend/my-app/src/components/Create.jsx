import React, { useState } from 'react';
import './Create.css';
import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { Cloudinary } from '@cloudinary/url-gen';

const Create = () => {
  const cld = new Cloudinary({ cloud: { cloudName: 'dk3ryoigu' } });

  const [product, setProduct] = useState({
    name: '',
    description: '',
    startingBid: '',
    endTime: '',
    category: '',
    image: null,
  });

  const [url, setUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      if (files.length > 0) {
        UploadToCloudinary(files[0]);
      }
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url) {
      console.error('Image is required');
      return;
    }

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('startingBid', product.startingBid);
    formData.append('endTime', product.endTime);
    formData.append('category', product.category);
    formData.append('url', url);
    console.log(url);
    const token = localStorage.getItem('token');
    console.log(token)
    const response = await fetch('http://localhost:9002/api/addBid', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
console.log(response)
    if (response.ok) {
      console.log('Product added successfully!');
      setProduct({
        name: '',
        description: '',
        startingBid: '',
        endTime: '',
        category: '',
        image: null,
      });
      alert('Product added successfully!');
    } else {
      console.error('Failed to add product:', response.statusText);
    }
  };

  const UploadToCloudinary = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');
    formData.append('cloud_name', 'dk3ryoigu');

    fetch('https://api.cloudinary.com/v1_1/dk3ryoigu/image/upload', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.secure_url);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div>
          <label>Starting Bid:</label>
          <input
            type="number"
            name="startingBid"
            value={product.startingBid}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>End Time:</label>
          <input
            type="datetime-local"
            name="endTime"
            value={product.endTime}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default Create;