const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const app = express();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const jwt = require('jsonwebtoken');
const cors = require('cors');
app.use(cors());

require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.use(express.json());

// User schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

// Bids schema
const bidsSchema = new mongoose.Schema({
  name: String,
  category: String, // Category of the bid
  description: String,
  startingBid: Number,
  currentBid: { type: Number, default: this.startingBid }, // Initially set to starting bid
  endTime: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imageUrl: String // URL of the uploaded image
});

const Bid = mongoose.model('Bid', bidsSchema);

const User = mongoose.model('User', userSchema);


cloudinary.config({
  cloud_name: 'dk3ryoigu',
  api_key: '558444457372669',
  api_secret: 'yFYHAaS6HTJL6SwhxElLW7rOPPs'
});


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'auctioneaseplatform@gmail.com', // Your Gmail email address
      pass: 'wqib pose sunz yjoz', // Use the generated app password here //this password is fake generated dont use for real purposes it wont work
    },
  });
// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists in the database' });
    }
   
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username:req.body.username,
      email:req.body.email,
      password: hashedPassword
    });

    // Save the new user
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await sendWelcomeEmail(newUser.email);
    res.status(200).json({ message: 'User successfully registered!' });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Email does not exist' });
  }

  // Compare the passwords
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Incorrect password' });
  }
  const token = jwt.sign({email:user.email, userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  res.status(200).json({ message: 'Login successful!' ,token:token});
});

// Forgot password endpoint
app.post('/api/forgotpassword', async (req, res) => {
    const { email } = req.body;
    
    try {
        const newPassword = generateNewPassword();
      // Call the sendForgotPasswordEmail function
      await sendForgotPasswordEmail(email,newPassword);
  
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  const generateNewPassword = () => {
    const randomBytes = crypto.randomBytes(8);
    return randomBytes.toString('hex');
  };
const sendForgotPasswordEmail = async (email,newPassword) => {
    try {
      // Check if the email exists in the database
      const user = await User.findOne({ email });
  
      if (!user) {
        console.error('Email not found');
        return;
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password in the database
      user.password = hashedPassword;
      await user.save();
  
      const mailOptions = {
        from: 'auctioneaseplatform.com', // Sender email address
        to: email,
        subject: 'Password Reset',
        text: `Dear user, we have received a forgot password request for your account. Your new password is: ${newPassword} Please do not share your password with anyone. We thank you for using our Online Auction System AuctionEase.`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return;
        }
  
        console.log('Email sent:', info.response);
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const sendWelcomeEmail = (email) => {
    const mailOptions = {
      from: 'auctioneaseplatform@gmail.com',
      to: email,
      subject: 'Welcome to AuctionEase - Online Auction System',
      text: `Dear user, Welcome to AuctionEase, the ultimate online auction system. Explore exciting features and start bidding on your favorite items. Thank you for choosing AuctionEase!`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending welcome email:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      console.log('Welcome email sent:', info.response);
      return res.status(200).json({ message: 'Welcome email sent successfully' });
    });
  };
  
  
  
  
  // Define the endpoint for adding a bid

  app.post('/api/addBid', async (req, res) => {
    const { name, description, startingBid, endTime, category,url} = req.body;
    
    try {
      if (!url) {
        
        return res.status(400).json({ message: 'Image data is required' });
      }
      

      
  console.log(name)
      const userId = getUserIdFromAuthentication(req);
      // Create a new bid instance
      const newBid = new Bid({
        name,
        description,
        startingBid,
        currentBid: startingBid,
        endTime,
        userId:req.userId,
        category,
        url, // Store the secure URL returned by Cloudinary
      });
     
      // Save the new bid to the database
      const savedBid = await newBid.save();
  
      // Respond with success message and the saved bid data
      res.status(200).json({ message: 'Bid added successfully', bid: savedBid });
    } catch (error) {
      console.error('Error adding bid:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  
  const getUserIdFromAuthentication = (req) => {
    // Extract user ID from JWT token in request headers
    const token = req.headers.authorization.split(' ')[1]; // Assuming JWT token is in the format: Bearer <token>
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  };




app.get('/api/products', async (req, res) => {
  try {
    // Fetch products from the bids table excluding bids created by the current user
    const products = await Bid.find({ userId: { $ne: req.userId } });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  
  // Modify Bid endpoint
  app.put('/api/modifyBid/:id', async (req, res) => {
    const bidId = req.params.id;
    const { newBid, currentBid } = req.body;
  
    try {
      // Fetch the bid
      const bid = await Bid.findById(bidId);
  
      if (!bid) {
        return res.status(404).json({ message: 'Bid not found' });
      }
  
      // Check if bidding has ended
      if (bid.endTime && new Date(bid.endTime) < new Date()) {
        return res.status(400).json({ message: 'Bidding for this product has already ended. Modification not allowed.' });
      }
  
      // Update startingBid and currentBid
      bid.startingBid = newBid;
      bid.currentBid = currentBid;
  
      // Save the updated bid
      const updatedBid = await bid.save();
  
      res.status(200).json({ message: 'Bid modified successfully', bid: updatedBid });
    } catch (error) {
      console.error('Error modifying bid:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Delete Bid endpoint
  app.delete('/api/deleteBid/:id', async (req, res) => {
    const bidId = req.params.id;
  
    try {
      const deletedBid = await Bid.findByIdAndRemove(bidId);
  
      if (!deletedBid) {
        return res.status(404).json({ message: 'Bid not found' });
      }
  
      res.status(200).json({ message: 'Bid deleted successfully', bid: deletedBid });
    } catch (error) {
      console.error('Error deleting bid:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  app.get('/api/sell', async (req, res) => {
    try {
      // Retrieve the user ID from the request or authentication context
      const userId = getUserIdFromAuthentication(req); // You need to implement this function
  
      // Fetch products added by the logged-in user
      const products = await Bid.find({ userId });
  
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// Start the server
const PORT = process.env.PORT || 9002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
