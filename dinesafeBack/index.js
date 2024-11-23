const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors({
    origin: ["https://web-jam-hackathon-front.vercel.app/"],
    methods: ["POST", "GET"],
    credentials: true
  }));
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb+srv://tester:testing123@atlascluster.frneldu.mongodb.net/";

const client = new MongoClient(uri);
let db;

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        db = client.db('oc_health');

        const count = await db.collection('oc_inspections').countDocuments();
        // console.log(`Found ${count} documents in oc_inspections`);
        app.set('db', db);
    } catch (error) {
        console.error("Could not connect to MongoDB:", error);
    }
}

connectDB();

// Routes
app.get('/api/restaurants', async (req, res) => {
    try {
        const restaurants = await db.collection('oc_inspections').find().toArray();
        res.json(restaurants);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Error fetching restaurants' });
    }
});

app.get('/api/300restaurants', async (req, res) => {
    try {
        const restaurants = await db.collection('oc_inspections2').find().toArray();
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

app.get('/api/place-photo', async (req, res) => {
    const { name, address } = req.query; // Accept both name and address
    const APIKEY = "AIzaSyDsEGZgrOkbNKUQaT_2OuMbBqNL5gjO1iI";
    const DEFAULT_PHOTO = "https://placehold.co/528x320/EEE/31343C?text=No+Photo+Available";

    if (!name && !address) {
        return res.json({ photoUrl: DEFAULT_PHOTO });
    }
    //console.log(name);
    const cleanName = name ? name.replace(/\^+$/, '').trim() : '';
    // console.log(cleanName);
    try {
        // Use name + address for more accurate results
        const searchQuery = cleanName 
            ? `${cleanName}`  // If we have a name, optionally include address
            : address;  // Fallback to just address

        const placeSearchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchQuery)}&inputtype=textquery&fields=place_id&key=${APIKEY}`;
        
        const searchResponse = await fetch(placeSearchUrl);
        const searchData = await searchResponse.json();
        
        // console.log('Search results:', searchData);  // Debug log

        if (searchData.status === 'OK' && searchData.candidates?.[0]?.place_id) {
            const placeId = searchData.candidates[0].place_id;
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos,name&key=${APIKEY}`;
            
            const detailsResponse = await fetch(detailsUrl);
            const detailsData = await detailsResponse.json();

            // console.log('Place details:', detailsData);  // Debug log

            if (detailsData.status === 'OK' && detailsData.result?.photos?.[0]?.photo_reference) {
                const photoReference = detailsData.result.photos[0].photo_reference;
                const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${APIKEY}`;
                return res.json({ photoUrl });
            }
        }
        
        return res.json({ photoUrl: DEFAULT_PHOTO });
    } catch (error) {
        console.error("Error fetching place photo:", error);
        return res.json({ photoUrl: DEFAULT_PHOTO });
    }
});

app.get('/api/search-restaurants', async (req, res) => {
    const { query } = req.query;
  
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
  
    try {
    //   console.log(`Searching for: ${query}`);
  
      const [results1, results2] = await Promise.all([
        db.collection('oc_inspections')
          .find({ name: { $regex: query, $options: 'i' } })
          .toArray(),
        db.collection('oc_inspections2')
          .find({ name: { $regex: query, $options: 'i' } })
          .toArray(),
      ]);
  
      const combinedResults = [...results1, ...results2];
    //   console.log(`Found ${combinedResults.length} results`);
  
      res.json(combinedResults);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Error searching for restaurants' });
    }
  });
  
