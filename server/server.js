const express = require('express')
const path = require('path')
const app = express()

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

