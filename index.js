const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.dpsxnyh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    const postCollection = client.db("banao-project").collection("allPost")

    try {

        app.post("/add-post", async (req, res) => {
            const query = req.body;
            const result = await postCollection.insertOne(query)
            res.send(result)
        })

        app.get("/all-post", async (req, res) => {
            const query = {}
            const result = await postCollection.find(query).sort({ _id: -1 }).toArray()
            res.send(result)
        })

        app.get("/role-of-post", async (req, res) => {
            const role = req.query.role
            const query = { postRole: role }
            const result = await postCollection.find(query).toArray()
            res.send(result)
        })

        app.get("/post-details/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await postCollection.findOne(query)
            res.send(result)
        })

    }

    finally {

    }
}

run().catch(error => console.log(error.message))


app.get("/", async (req, res) => {
    res.send("<h1>Banao projects server runnning </h1>")
})

app.listen(port, () => {
    console.log(`Server running port http://localhost:${port} `)
})