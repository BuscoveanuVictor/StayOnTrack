const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());



// Database connection
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

let db;
client.connect().then(() => {
    db = client.db("StayOnTrack");
});


app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello World from API!' });
});

app.post('/block_list/add_domain', async (req, res) => {
    const { domain } = req.body; // extrage domain din body
    console.log("Received request to add domain:", domain);
    await db.collection('users').updateOne(
        { nume: "Victor" },
        { $push: { block_list: domain } }
    );
    res.json({ message: "Domain added successfully" });
});


app.listen(5000, () => {
  console.log('Server running on port 5000');
});