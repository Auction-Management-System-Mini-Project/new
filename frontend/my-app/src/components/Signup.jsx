// Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './Signup.css';
import { TextField } from '@mui/material';
import Modal from './Modal';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [passwordRequirements, setPasswordRequirements] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prevState => ({
      ...prevState,
      [name]: inputValue
    }));

    if (name === 'password') {
      updatePasswordRequirements(value);
    }
  };

  const updatePasswordRequirements = (password) => {
    const requirements = [
      { text: 'Password must contain' },
      { text: 'At least 12 characters long', satisfied: password.length >= 12 },
      { text: 'Contain a combination of upper and lower-case letters', satisfied: /[a-z]/.test(password) && /[A-Z]/.test(password) },
      { text: 'Contain at least one digit', satisfied: /\d/.test(password) },
      { text: 'Contain at least one special character', satisfied: /[@$!%*?&]/.test(password) }
    ];
    setPasswordRequirements(requirements);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    if (!formData.agreeToTerms) {
      alert("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    try {
      const response = await fetch('http://localhost:9002/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error signing up. Please try again.');
      }

      const data = await response.json();
      console.log("Signup response:", data);
      navigate('/login');
      alert("Signup successful! You can now login with your credentials.");
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
      <div className="left-content">
    <h2>Welcome to Auctionease</h2>
    <p>Join our platform to discover amazing auctions!</p>
  </div>
      </div>
      <div className="signup-right">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <TextField
              label="Username"
              variant="standard"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <TextField
              label="Email"
              variant="standard"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <TextField
              label="Password"
              variant="standard"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <TextField
              label="Confirm Password"
              variant="standard"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
            <label htmlFor="agreeToTerms">
  <a href="#" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>I agree to the Terms of Service and Privacy Policy.</a>
</label>
          </div>
          <button type="submit" className="signup-button">Create Account</button>
        </form>
        <div className="login-link">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Signup;