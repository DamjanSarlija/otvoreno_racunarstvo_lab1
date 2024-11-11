const express = require("express")
const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile("index.html")
})

router.get("/preuzmiJson", (req, res) => {
    res.download("./data/studenci.json")
})

router.get("/preuzmiCsv", (req, res) => {
    res.download("./data/studenci.csv")
})

module.exports = router