var express = require('express');


var router = express.Router();

router.get("/pollens", function(req, res, next) {
res.status(200).json({
    message: "Handling GET requests to /pollens"

});

});
module.exports = router;