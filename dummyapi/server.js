const express = require("express");
const axios = require('axios');
const HOST = 'localhost'
const app = express();
const PORT = 8080;


app.use(express.json());


app.get('/dummyapi', (req, res, next) => {
    res.send("Hello From Dummy Api Server");
})
app.get('/dummybogusapi', (req, res, next) => {
    res.send("Dummy Bogus Api Server get request called");
})

app.post('/dummybogusapi', (req, res, next) => {
    res.send("Dummy Bogus Api Server post request called");
})

app.listen(PORT, () => {

    axios
    ({
        method: 'POST',
        url: "http://localhost:8000/register",
        headers: {'Content-Type': 'application/json'},
        data: {
            apiName: "testapi",
            protocol: "http",
            host: HOST,
            port: PORT,
        }
    })
    .then((response) => {
      console.log(response.data);
    })
    
    console.log("Dummy Server has started on port : ", PORT);
})