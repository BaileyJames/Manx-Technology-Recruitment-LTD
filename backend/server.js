const bodyParser = require('body-parser');
const express = require('express');
const {body, validationResult} = require('express-validator');
const cors = require('cors');
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
app.use(cors(
    {
        origin: process.env.LOCALHOST,
        credentials: true
    }
));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.LOCALHOST);
    next();
})
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
        res.status(401).json({ error: 'User is not authenticated' });
    }
}

const ensureAdmin = (req, res, next) => {
    console.log(req.user)
    if (req.isAuthenticated() && req.user.privilege == 1) {
        return next();
    }
    res.send("You do not have access").status(403);
}

app.get("/secrets", ensureAuthenticated, (req, res) => {
    console.log(req.user)
    res.send("You are authenticated").status(200);
})

app.post("/register",
    body('email').isEmail().normalizeEmail(),
    body('username').isLength({min: 6}),
    body('password').isLength({min: 12}).withMessage('Password must be at least 12 characters')
        .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain a number')
        .matches(/[!@#$%^&*]/).withMessage('Password must contain a special character'),
    async(req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next()
    },
    async (req, res) => {
    
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
    }
);

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

app.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err) {
            console.log("Error logging out: ", err);
            return next(err);
        }
        res.send("User logged out").status(200);
    });
})

app.get("/user", ensureAuthenticated, (req, res) => {
    res.send(req.user).status(200);
})

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const fileExtension = file.originalname.split(".")[1];
        cb(null, req.user._id + "." + fileExtension)
    }
})

const uploadFile = multer({storage: storage})

app.post("/documents", ensureAuthenticated, uploadFile.single('document'), async (req, res, next) => {
    console.log(req.file)

    let fileExtension = req.file.originalname.split(".")[1];

    try {
        await sftp.mkdir("/home/expo/user-documents/" + req.user._id, true)
    } catch (err) {
        console.error("Error creating directory")
    }

    try {
        await sftpFile("./uploads/" + req.user._id + "." + fileExtension, "/home/expo/user-documents/" + req.user._id + "/" +  req.file.fieldname + "." + fileExtension)
    } catch (err) {
        console.error("Error reading file:", err)
    }
    res.send("File uploaded").status(200);
})

app.get("/documents/:index", ensureAuthenticated, async (req, res) => {
    const dirPath = "/home/expo/user-documents/" + req.user._id;
    
    try {
        const fileList = await sftp.list(dirPath);
        console.log("AAAA", fileList)

        const stream = await sftp.createReadStream(dirPath + "/" + fileList[req.params.index].name);
        res.setHeader('Content-disposition', 'attachment; filename=' + fileList[req.params.index].name);
        res.setHeader('Content-type', 'application/octet-stream');
        stream.pipe(res);

    } catch (err) {
        console.error("Error reading file:", err)
        res.send("Error reading file").status(500);
    }
})

app.get("/documents", ensureAuthenticated, async (req, res) => {
    let files = await sftp.list("/home/expo/user-documents/" + req.user._id);
    let newFiles = []
    files.map(file => {
        console.log(file)
        newFiles.push(file.name);
    });
    res.send(newFiles).status(200);
})

app.get("/jobs", async (req, res) => {
    let jobs;
    if(req.query.desiredSkills) {
        let skills = req.query.desiredSkills.split(" ");
        skills = skills.map(skill => new ObjectId(skill));
        jobs = await client.db("Recruitment").collection("jobs").find({desiredSkills: {$in: skills}}).toArray();
    } else if(req.query._id) {
        jobs = await client.db("Recruitment").collection("jobs").findOne({_id: new ObjectId(req.query._id)});
     } else {
        jobs = await client.db("Recruitment").collection("jobs").find().toArray();
    }

    res.send(jobs);
});

app.get("/skills", async (req, res) => {
    //const skills = await client.db("Recruitment").collection("skills").find().toArray();
    let skills
     if(req.query._id) {
        skills = await client.db("Recruitment").collection("skills").findOne({_id: new ObjectId(req.query._id)});
     } else {
        skills = await client.db("Recruitment").collection("skills").find().toArray();
    }
    res.send(skills)
})

app.post("/add-job", ensureAdmin, async (req, res) => {
    console.log(req.body)
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
        desiredSkills: new ObjectId(desiredSkills),
        companyId: new ObjectId(companyId)
    });
    res.send("Successfully added " + title + " to the database.").status(200);
})

app.put("/update-job", ensureAdmin, async (req, res) => {
    const {_id, title, description, schedule, location, salary, postDate, deadline, desiredSkills, companyId} = req.body;
    let collection = await client.db("Recruitment").collection("jobs");
    let updateJob = await collection.updateOne(
        {_id: new ObjectId(_id)},
        {
            $set: {
                title: title,
                description: description,
                schedule: schedule,
                location: location,
                salary: salary,
                postDate: postDate,
                deadline: deadline,
                desiredSkills: desiredSkills,
                companyId: new ObjectId(companyId)
            }
        }
    )
    if (updateJob.modifiedCount == 1) {
        res.send("Successfully updated " + title).status(200);
    } else {
        res.send("Error updating job, job either doesn't exist or no changes were created").status(500);
    }
})

app.delete("/delete-job", ensureAdmin, async (req, res) => {
    const _id = req.body._id;
    let collection = await client.db("Recruitment").collection("jobs");
    let deleteJob = await collection.deleteOne({_id: new ObjectId(_id)});
    if (deleteJob.deletedCount == 1) {
        res.send("Successfully deleted job").status(200);
    } else {
        res.send("Error deleting job, job either doesn't exist or no changes were created").status(500);
    }
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

app.put("/update-company", ensureAdmin, async (req, res) => {
    const {_id, name, email, phone} = req.body;
    let collection = await client.db("Recruitment").collection("companies");
    let updateCompany = await collection.updateOne(
        {_id: new ObjectId(_id)},
        {
            $set: {
                name: name,
                email: email,
                phone: phone
            }
        }
    )
    if (updateCompany.modifiedCount == 1) {
        res.send("Successfully updated " + name).status(200);
    } else {
        res.send("Error updating company, it either doesn't exist or no changes were created").status(500);
    }
})

app.delete("/delete-company", ensureAdmin, async (req, res) => {
    const _id = req.body._id;
    let collection = await client.db("Recruitment").collection("companies");
    let deleteCompany = await collection.deleteOne({_id: new ObjectId(_id)});
    if (deleteCompany.deletedCount == 1) {
        res.send("Successfully deleted company").status(200);
    } else {
        res.send("Error deleting company, it either doesn't exist or no changes were created").status(500);
    }
})

app.post("/add-skill", ensureAdmin, async (req, res) => {
    const {name, description} = req.body;
    let collection = await client.db("Recruitment").collection("skills");
    let addSkill = await collection.insertOne({
        name: name,
        description: description
    });
    res.send("Successfully added skill: " + name + " to the database.").status(200);
})

app.put("/update-skill", ensureAdmin, async (req, res) => {
    const {_id, name, description} = req.body;
    let collection = await client.db("Recruitment").collection("skills");
    let updateSkill = await collection.updateOne(
        {_id: new ObjectId(_id)},
        {
            $set: {
                name: name,
                description: description
            }
        }
    )
    if (updateSkill.modifiedCount == 1) {
        res.send("Successfully updated " + name).status(200);
    } else {
        res.send("Error updating skill, it either doesn't exist or no changes were created").status(500);
    }
})

app.delete("/delete-skill", ensureAdmin, async (req, res) => {
    const _id = req.body._id;
    let collection = await client.db("Recruitment").collection("skills");
    let deleteSkill = await collection.deleteOne({_id: new ObjectId(_id)});
    if (deleteSkill.deletedCount == 1) {
        res.send("Successfully deleted skill").status(200);
    } else {
        res.send("Error deleting skill, it either doesn't exist or no changes were created").status(500);
    }
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