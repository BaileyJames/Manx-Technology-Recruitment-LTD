const bodyParser = require('body-parser');
const express = require('express');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_CONNECTION_STRING;

const client = new MongoClient(uri);

let connection;

async function connect() {
    try {
        await client.connect();
        await client.db("Recruitment").command({ ping: 1 });
        console.log("Successful ping, connected to the database");
    } catch (e) {
        console.error(e);
    }
}

connect();

app.post("/register", async (req, res) => {
    let collection = await client.db("Recruitment").collection("users");
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;

    let existingUser = await collection.findOne({ email: email });
    if (existingUser) {
        res.send("User with email " + email + " already exists");
        return;
    }

    let newUser = await collection.insertOne({ email: email, username: username, password: password });
    res.send("Successfully registered user " + username);
});

app.post("/login", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    let user = await client.db("Recruitment").collection("users").findOne({ email: email, password: password });
    
    if (user) {
        res.send("Successfully logged in as " + user.username);
        return;
    }
    res.send("Invalid email or password");
});

app.get("/", (req, res) => {
    res.send("Hello");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})