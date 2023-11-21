const express = require("express");

const app = express();
const PORT = 8080;


app.use(express.json());


app.get('/dummyapi', (req, res, next) => {
    res.send("Hello From Dummy Api Server");
})

app.get('/dummybogusapi', (req, res, next) => {
    res.send("Dummy Bogus Api Server called");
})

app.listen(PORT, () => {
    console.log("Dummy Server has started on port : ", PORT);
})