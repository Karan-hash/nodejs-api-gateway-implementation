const express = require("express");
const axios = require("axios");
const router = express.Router();
const registry = require("./registry.json");
const fs = require('fs');
router.all("/:apiName/:path", (req, res) => {
  console.log(req.params.apiName);
//   res.send(req.params.apiName + "\n");
 if (registry.services[req.params.apiName]){
    axios
    ({
        method: req.method,
        url: registry.services[req.params.apiName].url + req.params.path,
        headers: req.headers,
        data: req.body
    })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.error("Error fetching data from the API:", error.message);
      res.status(500).send("Internal Server Error");
    });
 }
 else{
    res.send(" API Name Doesn't exist")
 }
 
});


/**
This end point will help us to register new endpoints in registery.json, We also have to pass host info which is in present in registry
{
            "apiName": "testapi",
            "host": "http://localhost",
            "port": 8080,
            "url": "http://localhost:8080/"
        }

**/
router.post('/register', (req, res) => {
    const registrationInfo = req.body;
    registrationInfo.url = registrationInfo.protocol + "://" + registrationInfo.host + ":" + registrationInfo.port + "/"
    registry.services[registrationInfo.apiName] = { ... registrationInfo }

    fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
        if(error){
            res.send("Could not register " + registrationInfo.apiName + "'\n" + error)
        }
        else{
            res.send("Successfully registered " + registrationInfo.apiName);
        }
    })
})
module.exports = router;
