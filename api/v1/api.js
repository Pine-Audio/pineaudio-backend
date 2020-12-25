var express = require('express');
var router = express.Router();


router.get("/authenticate/", require("./routes/auth/"))

module.exports = router;