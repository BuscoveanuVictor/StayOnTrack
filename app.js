const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());
app.set("view engine", "ejs");

const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

let db;
client.connect().then(() => {
    db = client.db("StayOnTrack");
});

// Exemplu route
app.get('/', (req, res) => {
    console.log("Received request for index page");
    res.render("index")
});

app.get('/block_list', (req, res) => {
    res.sendFile(__dirname + '/block_list.html');
});

app.post('/block_list/add_domain', async (req, res) => {
    const { domain } = req.body;
    await db.collection('users').updateOne(
        { nume: "Victor" },
        { $push: { block_list: domain } }
    );
    res.json({ message: "Domain added successfully", domain });
});

app.get('/block_list/load_block_list', async (req, res) => {
    const data = await db.collection('users').findOne({ nume: "Victor" });
    res.json({ block_list: data?.block_list || [] });
});

// Adaugă și celelalte rute similare...

app.listen(80, () => {
    console.log('Server running on port 80');
});