const fs = require("fs")
const express = require("express")

const app = express()


const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, "utf-8"))
app.get("/api/v1/tours", (req, res) => {
    res
        .status(200)
        .json({
            message: "success",
            count: tours.length,
            data: { tours },
            status:true
        })
        //.send("Hello World from server side")
} )


/////////////////////////[post]
app.post("/", (req, res) => {
    res.send("posting data")
})

let port = 3000
app.listen(port, () => {
    console.log(`app running on port ${port}`)
})
