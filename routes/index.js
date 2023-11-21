const express = require("express");
const axios = require("axios");
const router = express.Router();

router.all("/:apiName", (req, res) => {
  console.log(req.params.apiName);
//   res.send(req.params.apiName + "\n");
  axios
    .get("http://localhost:8080/" + req.params.apiName)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.error("Error fetching data from the API:", error.message);
      res.status(500).send("Internal Server Error");
    });
});
module.exports = router;
