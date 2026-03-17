const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB, sequelize } = require('./config/database');
const { runMigrations } = require('./config/migrator');
const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes');
const customerRoutes = require('./routes/customerRoutes');
const installmentRoutes = require('./routes/installmentRoutes');

const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files
app.use('/public', express.static(path.join(__dirname, '../public')));

// Database connection & Migrations
const initializeApp = async () => {
    await connectDB();
    await runMigrations();
};

initializeApp();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/installments', installmentRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('Installment App Backend is running...');
});

// Port configuration
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});