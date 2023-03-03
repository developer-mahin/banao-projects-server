const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get("/", async (req, res) => {
    res.send("<h1>Banao projects server runnning </h1>")
})

app.listen(port, () => {
    console.log(`Server running port http://localhost:${port} `)
})