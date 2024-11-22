const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = "mongodb+srv://tester:testing123@atlascluster.frneldu.mongodb.net/";
const client = new MongoClient(uri);
let db;

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        db = client.db('oc_health');

        const count = await db.collection('oc_inspections').countDocuments();
        console.log(`Found ${count} documents in oc_inspections`);
        app.set('db', db);
    } catch (error) {
        console.error("Could not connect to MongoDB:", error);
    }
}

connectDB();

// Routes
app.get('/api/restaurants', async (req, res) => {
    try {
        console.log("here");
        const restaurants = await db.collection('oc_inspections').find().toArray();
        res.json(restaurants);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Error fetching restaurants' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});