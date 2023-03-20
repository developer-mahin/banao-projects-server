const express = require("express")
const app = express()
const cors = require("cors")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.dpsxnyh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send({ message: "Unauthorized Access" })
    }
    const token = authHeader.split(" ")[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            res.status(403).send({ message: "Unauthorized Access" })
        }
        req.decoded = decoded
        next()
    })
}



async function run() {

    const postCollection = client.db("banao-project").collection("allPost")
    const usersCollection = client.db("banao-project").collection("users")

    try {

        // jwt token 
        app.post("/jwt", (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "7d" })
            res.send({ token })
        })

        // api for upload post
        app.post("/add-post", verifyJWT, async (req, res) => {
            const query = req.body;
            const result = await postCollection.insertOne(query)
            res.send(result)
        })

        // api for getting all post
        app.get("/all-post", verifyJWT, async (req, res) => {
            const query = {}
            const result = await postCollection.find(query).sort({ _id: -1 }).toArray()
            res.send(result)
        })

        // api for specific post
        app.get("/role-of-post", verifyJWT, async (req, res) => {
            const role = req.query.role
            const query = { postRole: role }
            const result = await postCollection.find(query).sort({ _id: -1 }).toArray()
            res.send(result)
        })

        // api for post details
        app.get("/post-details/:id", verifyJWT, async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await postCollection.findOne(query)
            res.send(result)
        })

        // save user in db
        app.post("/save-user", verifyJWT, async (req, res) => {
            const userInfo = req.body

            const result = await usersCollection.insertOne(userInfo)
            res.send(result)
        })

        app.get("/profile", async (req, res) => {
            const queryEmail = req.query.email;
            const filter = { email: queryEmail }
            const result = await usersCollection.findOne(filter)
            res.send(result)
        })

    }

    finally {

    }
}

run().catch(error => console.log(error.message))


app.get("/", async (req, res) => {
    res.send("<h1>Jobs projects server running </h1>")
})

app.listen(port, () => {
    console.log(`Server running port http://localhost:${port} `)
})