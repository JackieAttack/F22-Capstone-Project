const express = require('express')
const cors = require("cors")
const path = require('path')
const app = express()

app.use(cors());
app.use(express.json())

//server endpoints
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"))
})

app.get("/styles", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.css"))
})

app.get("/js", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.js"))
})

//Front end interaction
const {searchGeneId} = require('./server/controller')

app.get("/search/:term", searchGeneId)
//app.get("/moreInfo/:id", searchGeneId)


const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})