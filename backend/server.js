const bodyParser = require('body-parser');
const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const Strategy  = require('passport-local').Strategy;
const MongoStore = require('connect-mongo');
const multer = require('multer')
let Client = require('ssh2-sftp-client')
let sftp = new Client();

sftp.connect({
    host: process.env.SFTP_IP,
    port: 22,
    username: 'expo',
    password: process.env.SFTP_PASS
}).then(() => {
    return sftp.list("/home/expo/user-documents")
}).then(data => {
    data.forEach(file => {
        console.log("file:", file.name, file.type)
    })
}).catch(err => {
    console.log("Error:", err)
})

const sftpFile = async (localFile, remoteFile) => {
    console.log(`Uploading ${localFile} to ${remoteFile}`);
    try {
        await sftp.put(localFile, remoteFile);
    } catch (err) {
        console.error("Error uploading file: ", err)
    }
}

const app = express();
const saltRounds = 5;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = process.env.MONGO_CONNECTION_STRING;

const client = new MongoClient(uri);

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
    store: MongoStore.create({
        mongoUrl: uri,
        dbName: "Recruitment",
        collectionName: "sessions"
    })
}))

app.use(passport.initialize());
app.use(passport.session())



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

const ensureAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login")
    }
}

const ensureAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.privilege == 1) {
        return next();
    }
    res.send("You do not have access").status(403);
}

app.get("/secrets", ensureAuthenticated, (req, res) => {
    console.log(req.user)
    res.send("You are authenticated").status(200);
})

app.post("/register", async (req, res) => {
    let collection = await client.db("Recruitment").collection("users");
    let { email, username, password, firstName, lastName, address, phone } = req.body;


    let existingUser = await collection.findOne({ email: email });
    if (existingUser) {
        res.send("User with email " + email + " already exists");
        return;
    }
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            console.log("Error hasing password: " + err);
            res.status(500).send('Error hashing password');
            return;
        }

        let addUser = await collection.insertOne({
            email: email,
            username: username,
            password: hash,
            firstName: firstName,
            lastName: lastName,
            address: address,
            phone: phone
        });
        let userId = addUser.insertedId;

        let newUser = await collection.findOne({ _id: userId });

        req.login(newUser, (err) => {
            if(err) {
                console.log("Error logging in: " + err);
            }
            res.redirect("/secrets");
        })
    })

});

app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user) => {
        if(!user) {
            return res.status(401).send("Invalid username or password");
        }

        if (err) {
            return res.status(500).send("Error authenticating user");
        }
       
        req.login(user, (err) => {
            if (err) {
                return res.status(500).send("Error logging in");
            }

            delete req.user.password;
            return res.json(user).status(200);     
        })
    })(req, res, next);
})

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const name = "hi";
        cb(null, req.user._id + "+" + file.fieldname)
    }
})

const uploadFile = multer({storage: storage})

app.post("/documents", ensureAuthenticated, uploadFile.single('document'), async (req, res, next) => {
    console.log(req.file)

    try {
        await sftp.mkdir("/home/expo/user-documents/" + req.user._id, true)
    } catch (err) {
        console.error("Error creating directory")
    }

    await sftpFile("./uploads/" + req.user._id + "+" + req.file.fieldname, "/home/expo/user-documents/" + req.user._id + "/" +  req.file.fieldname)
    res.send("File uploaded").status(200);
})

app.get("/documents/:filename", ensureAuthenticated, async (req, res) => {
    const filePath = "/home/expo/user-documents/" + req.user._id + "/" + req.params.filename;
    
    try {
        const stream = await sftp.createReadStream(filePath);

        res.setHeader('Content-disposition', 'attachment; filename=' + req.params.filename);
        res.setHeader('Content-type', 'application/octet-stream');

        stream.pipe(res);
    } catch (err) {
        console.error("Error reading file: ", err);
        res.send("Error reading file").status(500);
    }
})

app.get("/documents", ensureAuthenticated, async (req, res) => {
    let files = await sftp.list("/home/expo/user-documents/" + req.user._id);
    let newFiles = []
    files.map(file => {
        console.log(file)
    });
    res.send(newFiles).status(200);
})

app.get("/jobs", async (req, res) => {
    let jobs;
    if(req.query.desiredSkills) {
        let skills = req.query.desiredSkills.split(" ");
        skills = skills.map(skill => new ObjectId(skill));
        jobs = await client.db("Recruitment").collection("jobs").find({desiredSkills: {$in: skills}}).toArray();
    } else {
        jobs = await client.db("Recruitment").collection("jobs").find().toArray();
    }

    res.send(jobs);
});

app.get("/skills", async (req, res) => {
    const skills = await client.db("Recruitment").collection("skills").find().toArray();
    res.send(skills)
})

app.post("/add-job", ensureAdmin, async (req, res) => {
    const {title, description, schedule, location, salary, postDate, deadline, desiredSkills, companyId} = req.body;
    let collection = await client.db("Recruitment").collection("jobs");
    let addJob = await collection.insertOne({
        title: title,
        description: description,
        schedule: schedule,
        location: location,
        salary: salary,
        postDate: postDate,
        deadline: deadline,
        desiredSkills: desiredSkills,
        companyId: new ObjectId(companyId)
    });
    res.send("Successfully added " + title + " to the database.").status(200);
})

app.post("/add-company", ensureAdmin, async (req, res) => {
    const {name, email, phone} = req.body;
    let collection = await client.db("Recruitment").collection("companies");
    let addCompany = await collection.insertOne({
        name: name,
        email: email,
        phone: phone
    });
    res.send("Successfully added company: " + name + " to the database.").status(200);
})


passport.use(new Strategy(async function verify(username, password, cb) {

    console.log(username);

    let user = await client.db("Recruitment").collection("users").findOne({ username: username });


    if (user) {
        let storedPassword = user.password;

        bcrypt.compare(password, storedPassword, (err, result) => {
            if (err) {
                return cb(err);
            }
            if (result) {
                return cb(null, user);
            }
            return cb(null, false);
        })
        return;
    }
    return cb("User not found")
}))

passport.serializeUser((user, cb) => {
    cb(null, user);
})

passport.deserializeUser((user, cb) => {
    cb(null, user);
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})