import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import Profile from './components/Profile'; // Import the default export without curly braces
import Create from './components/Create';
import Sell from './components/Sell';
import ProductDescription from './components/ProductDescription';
import Admin from './components/Admin';
import ProductDisplay from './components/ProductDisplay';
import EditSell from './components/Editsell';
import ViewUser from './components/ViewUser';
import Home2 from './components/Home2'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage authentication status
  const [isAdmin, setIsAdmin] = useState(false); 
  const handleLogin = (user) => {
    // Logic to handle successful login
    setIsLoggedIn(true);
    setIsAdmin(user.email === 'auctioneaseplatform@gmail.com');
  };

  const handleLogout = () => {
    // Logic to handle logout
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.href = '/';
  };

  // Route guard function to restrict access to the admin page
  const AdminRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} handleLogout={handleLogout} /> {/* Pass authentication props to Navbar */}
      <Routes>
        <Route path="/" element={<Home2 />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login setLoginUser={handleLogin} setIsAdmin={setIsAdmin}/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create" element={<Create />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/admin" element={<AdminRoute element={<Admin />} />} />
        <Route path='/productdisplay' element={<ProductDisplay/>}/>
        <Route path="/productdescription/:id" element={<ProductDescription />} />
        <Route path="/editsell/:id" element={<EditSell />} />
        <Route path="/viewuser/:userId" element={<ViewUser/>} />
      </Routes>
    </Router>
  );
};

export default App;
