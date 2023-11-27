const express = require("express");
const axios = require("axios");
const router = express.Router();
const registry = require("./registry.json");
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
module.exports = router;
