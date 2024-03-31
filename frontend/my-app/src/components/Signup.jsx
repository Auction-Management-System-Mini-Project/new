import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordRequirements, setPasswordRequirements] = useState([]);

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  if (name === 'password') {
    updatePasswordRequirements(value);
  }
};

  const updatePasswordRequirements = (password) => {
    const requirements = [
      { text: 'At least 12 characters long', satisfied: password.length >= 12 },
      { text: 'Contain a combination of upper and lower-case letters', satisfied: /[a-z]/.test(password) && /[A-Z]/.test(password) },
      { text: 'Contain at least one digit', satisfied: /\d/.test(password) },
      { text: 'Contain at least one special character', satisfied: /[@$!%*?&]/.test(password) }
    ];
    setPasswordRequirements(requirements);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match. Please try again.");
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
      <form className="signup-form" onSubmit={handleSubmit}>
        <label className="signup-label">
          Username:
          <input
            className="signup-input"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
          />
        </label>
        <label className="signup-label">
          Email:
          <input
            className="signup-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </label>
        <label className="signup-label">
          Password:
          <input
            className="signup-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            />
            {/* Display password requirements */}
            <div className="password-requirements">

              <ul>
                {passwordRequirements.map((requirement, index) => (
                  <li key={index} className={requirement.satisfied ? 'satisfied' : ''}>{requirement.text}</li>
                ))}
              </ul>
            </div>
          </label>
        <label className="signup-label">
          Confirm Password:
          <input
            className="signup-input"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />
        </label>
        <button className="signup-button" type="submit">Sign up</button>
      </form>
      <div className="signup-login-link">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default Signup;