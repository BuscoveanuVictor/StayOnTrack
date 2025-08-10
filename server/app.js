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

app.post('/block-list/add-domain', async (req, res) => {
    const { domain } = req.body; // extrage domain din body
    console.log("Received request to add domain:", domain);
    await db.collection('users').updateOne(
        { nume: "Victor" },
        { 
          $set: { "block_list.last_updated": Date.now()},
          $push: { "block_list.domains": domain } 
        }
    );
    res.json({ message: "Domain added successfully" });
});

app.get('/block-list/blocked-sites.json', async (req, res) => {
    try {
        await db.collection('users').findOne({ nume: "Victor" }).then((user) => {
          res.json(
            {
              block_list: user.block_list.domains || [],
              last_updated: user.block_list.last_updated || Date.now()
            });
        });
    } catch (error) {
        console.error("Error fetching blocked sites:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/block-list/remove-domain', async (req, res) => {
    const { domain } = req.body; // extrage domain din body
    console.log("Received request to remove domain:", domain);
    await db.collection('users').updateOne(
        { nume: "Victor" },
        { 
          $set: { "block_list.last_updated": Date.now()},
          $pull: { "block_list.domains": domain } 
        }
    );
    res.json({ message: "Domain removed successfully" });
});

app.get('/blocked-sites.json/last-updated', async (req, res) => {
    try {
        const user = await db.collection('users').findOne({ nume: "Victor" });
        if (user) {
            res.json({ last_updated: user.block_list.last_updated || Date.now() });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error("Error fetching last updated time:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});