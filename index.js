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
    const commentCollection = client.db("banao-project").collection("comments")


    try {

        // jwt token 
        app.post("/jwt", (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "365days" })
            res.send({ token })
        })

        // api for upload post JWT
        app.post("/add-post", verifyJWT, async (req, res) => {
            const query = req.body;
            const result = await postCollection.insertOne(query)
            res.send(result)
        })

        // api for getting all post JWT
        app.get("/all-post", verifyJWT, async (req, res) => {
            const query = {}
            const result = await postCollection.find(query).sort({ _id: -1 }).toArray()
            res.send(result)
        })

        // api for specific post JWT
        app.get("/role-of-post", verifyJWT, async (req, res) => {
            const role = req.query.role
            const query = { postRole: role }
            const result = await postCollection.find(query).sort({ _id: -1 }).toArray()
            res.send(result)
        })

        // api for post details JWT
        app.get("/post-details/:id", verifyJWT, async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await postCollection.findOne(query)
            res.send(result)
        })

        // save user in db JWT
        app.post("/save-user", verifyJWT, async (req, res) => {
            const userInfo = req.body
            const result = await usersCollection.insertOne(userInfo)
            res.send(result)
        })

        // get profile for specific user JWT
        app.get("/profile", verifyJWT, async (req, res) => {
            const queryEmail = req.query.email;
            const filter = { email: queryEmail }
            const result = await usersCollection.findOne(filter)
            res.send(result)
        })


        // api for adding comment JWT
        app.patch("/comment/:id", verifyJWT, async (req, res) => {
            const id = req.params.id
            const comment = req.body;
            const query = { _id: new ObjectId(id) }
            const option = {
                $push: {
                    comment: comment
                }
            }
            const result = await postCollection.updateOne(query, option)
            res.send(result)
        })


        // update contact info JWT
        app.patch("/edit-contact/:id", verifyJWT, async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const info = req.body;
            const option = { upsert: true }
            const updatedDoc = {
                $set: {
                    info: info
                }
            }

            const result = await usersCollection.updateOne(query, updatedDoc, option)
            res.send(result)
        })

        // update userinfo JWT
        app.patch("/edit-info/:id", verifyJWT, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const info = req.body;

            const updatedDoc = {
                $set: {
                    name: info.name,
                    headLine: info.headline,
                    education: info.education
                }
            }

            const result = await usersCollection.updateOne(query, updatedDoc, option)
            res.send(result)
        })

        // update or change profile picture JWT
        app.patch("/change-profile-pic/:id", verifyJWT, async (req, res) => {
            const id = req.params.id;
            const info = req.body;
            const query = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updatedDoc = {
                $set: {
                    photo: info.image,
                }
            }

            const result = await usersCollection.updateOne(query, updatedDoc, option)
            res.send(result)
        })

        // update or change cover picture JWT
        app.patch("/change-cover-pic/:id", verifyJWT, async (req, res) => {
            const id = req.params.id;
            const info = req.body;
            const query = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updatedDoc = {
                $set: {
                    coverPhoto: info.image,
                }
            }

            const result = await usersCollection.updateOne(query, updatedDoc, option)
            res.send(result)
        })

        // get a specific user details
        app.get("/user-details/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.findOne(query)
            res.send(result)
        })

        // get api for getting specific user post data JWT
        app.get("/user-post", verifyJWT, async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email }
            const result = await postCollection.find(query).toArray()
            res.send(result)
        })

        // get api for getting specific user post using user name query JWT
        app.get("/user-details-post", verifyJWT, async (req, res) => {
            const name = req.query.name;
            const query = { userName: name }
            const result = await postCollection.find(query).toArray()
            res.send(result)
        })


        app.get("/user-post-details/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await postCollection.findOne(query)
            res.send(result)
        })

        // api for adding like JWT
        app.patch("/like/:id", verifyJWT, async (req, res) => {
            const id = req.params.id;
            const like = req.body;

            const query = { _id: new ObjectId(id) }
            const option = {
                $push: {
                    like: like.likes
                }
            }

            const result = await postCollection.updateOne(query, option)
            res.send(result)
        })

        // get api for getting  all user  JWT
        app.get("/all-users", verifyJWT, async (req, res) => {
            const query = {}
            const result = await usersCollection.find(query).toArray()
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