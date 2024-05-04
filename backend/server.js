const express = require('express');
const app = express();
require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_CONNECTION_STRING;

const client = new MongoClient(uri);

let connection;

async function connect() {
    try {
        await client.connect();
        await client.db("Recruitment").command({ ping: 1 });
        console.log("Successful ping, connected to the database");
    } finally {
        await client.close();
    }
}

connect().catch(console.error);

app.get("/", (req, res) => {
    res.send("Hello");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})