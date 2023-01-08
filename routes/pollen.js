const express = require('express');
const { db } = require('../models/model_Store');

const router = express.Router();

router.get("/pollens", async function(req, res, next) {
    const data = await db.collection('pollens').find().toArray();
    res.status(200).json({ data });
});

router.get("/places", async function(req, res, next) {
    const data = await db.collection('places').find().toArray();
    res.status(200).json({ data });
});

module.exports = router;