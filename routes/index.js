const express = require("express");
const axios = require("axios");
const router = express.Router();
const registry = require("./registry.json");
const fs = require("fs");
router.all("/:apiName/:path", (req, res) => {
  console.log(req.params.apiName);
  //   res.send(req.params.apiName + "\n");
  if (registry.services[req.params.apiName]) {
    axios({
      method: req.method,
      url: registry.services[req.params.apiName].url + req.params.path,
      headers: req.headers,
      data: req.body,
    })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from the API:", error.message);
        res.status(500).send("Internal Server Error");
      });
  } else {
    res.send(" API Name Doesn't exist");
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
router.post("/register", (req, res) => {
  const registrationInfo = req.body;
  registrationInfo.url =
      registrationInfo.protocol +
      "://" +
      registrationInfo.host +
      ":" +
      registrationInfo.port +
      "/";
  if (apiAlreadyExists(registrationInfo)) {
    // Return already exists
    res.send("Configuration already exists for " + registrationInfo.apiName + "at" + registrationInfo.url);
  } else {

    registry.services[registrationInfo.apiName].push({ ...registrationInfo });

    fs.writeFile(
      "./routes/registry.json",
      JSON.stringify(registry),
      (error) => {
        if (error) {
          res.send(
            "Could not register " + registrationInfo.apiName + "'\n" + error
          );
        } else {
          res.send("Successfully registered " + registrationInfo.apiName);
        }
      }
    );
  }
});

router.post('/unregister', (req, res) => {
  const registrationInfo = req.body;
  if(apiAlreadyExists(registrationInfo)){

    const index = registry.services[registrationInfo.apiName].findIndex( instance => {
      return registrationInfo.url === instance.url
    } )
    registry.services[registrationInfo.apiName].splice(index, 1);
    fs.writeFile(
      "./routes/registry.json",
      JSON.stringify(registry),
      (error) => {
        if (error) {
          res.send(
            "Could not unregister " + registrationInfo.apiName + "'\n" + error
          );
        } else {
          res.send("Successfully unregistered " + registrationInfo.apiName);
        }
      }
    );
  }
  else{
    res.send("Configuration doesn't exists for " + registrationInfo.apiName + "at" + registrationInfo.url);
  }
})
const apiAlreadyExists = (registrationInfo) => {
  // Check if registry and registry.services exist
  if (!registry || !registry.services) {
    return false;
  }

  // Check if registry.services[registrationInfo.apiName] is defined
  if (registry.services[registrationInfo.apiName]) {
    // Use forEach only if registry.services[registrationInfo.apiName] is an array
    if (Array.isArray(registry.services[registrationInfo.apiName])) {
      let exists = false;
      registry.services[registrationInfo.apiName].forEach(instance => {
        if (instance.url === registrationInfo.url) {
          exists = true;
          return;
        }
      });
      return exists;
    } else {
      // Handle the case where registry.services[registrationInfo.apiName] is not an array
      console.error('Invalid data structure for services');
      return false;
    }
  } else {
    // Handle the case where registry.services[registrationInfo.apiName] is undefined
    return false;
  }
}
module.exports = router;
