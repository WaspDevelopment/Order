// // index.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Connect to MongoDB (replace 'mongodb://localhost:27017/hotel' with your MongoDB connection string)
mongoose.connect('mongodb+srv://yay:yay@cluster0.63xsend.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Define MongoDB schema
const registrationSchema = new mongoose.Schema({
    orderId: String,
    roomId: String,
    stayId: String,
    // Add more fields as needed
});

const Registration = mongoose.model('Registration', registrationSchema);

// Middleware to parse JSON
app.use(express.json());

// Serve the registration form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/registration.html');
});

// Handle registration submission
app.post('/register', async (req, res) => {
    const registrationDetails = req.body;

    try {
        const newRegistration = new Registration(registrationDetails);
        const savedRegistration = await newRegistration.save();
        res.json({ orderId: savedRegistration.orderId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Admin panel to view registrations by ID
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

// Get registration details by ID
app.get('/admin/registrations/:id', async (req, res) => {
    const orderId = req.params.id;

    try {
        const registration = await Registration.findOne({ orderId });
        if (registration) {
            res.json(registration);
        } else {
            res.status(404).send('Registration not found');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
