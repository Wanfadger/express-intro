const express = require("express")

const app = express()


app.get("/", (req, res) => {
    console.log(req)
    res
        .status(200)
        .json({ message: "Hello World from server side" })
        //.send("Hello World from server side")
} )

let port = 3000
app.listen(port, () => {
    console.log(`app running on port ${port}`)
})
