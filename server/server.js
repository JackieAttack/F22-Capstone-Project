require('dotenv').config()
const express = require('express')
const cors = require("cors")
const path = require('path')
const app = express()

app.use(express.json())
app.use(cors());

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

app.get("/icon", (req, res) => {
    res.sendFile(path.join(__dirname, "../public//pictures/dna-icon-2316641_960_720.png"))
})

app.get("/background", (req, res) => {
    res.sendFile(path.join(__dirname, "../public//pictures/dna-14.jpg"))
})

//Front end interaction
const {searchGeneId, seed, postComment, returnComments} = require('./controller')

app.get("/search/:term", searchGeneId)
app.post('/seed', seed)
app.post('/createcomment', postComment)
app.get('/returncomments/:uid', returnComments)

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})