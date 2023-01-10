const express = require('express');
const Pollen = require('../models/model_Pollen');
const { db } = require('../models/model_Store');
const router = express.Router();

router.get("/pollens", async function(req, res, next) {
    const data = await db.collection('pollens').find().toArray();
    console.log('data', data);
    res.status(200).json({ data });
});

router.get("/places", async function(req, res, next) {
    const data = await db.collection('places').find().toArray();
    res.status(200).json({ data });
});

router.get("pollens_coordinates", async function(req, res, next) {
    const data = await db.collection('pollens').find().toArray();
    res.status(200).json({ data });
});

router.post("/add-pollen", async function(req, res, next) {
    


    const province = req.body[0].province;
    const value = req.body[0].value;
    const color = req.body[0].color;
    const forecast = req.body[0].forecast;
    const pro_id = req.body[0].pro_id;
    const pollen = await new Pollen({
        province,
        value,
        color,
        forecast,
        pro_id
    });
    const file = req.file;
    console.log('file', file);

    console.log('pollen', pollen);
    pollen
        .save()
        .then(results => {
            console.log(results);
            console.log('Created Pollen');
            res.status(200).json({ message: 'Success!', data: results });
        }
        )
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
        );
});



module.exports = router;