const express = require('express');
const Pollen = require('../models/model_Pollen');

const router = express.Router();

router.get("/pollens", async function(req, res, next) {
    const data = await Pollen.find();
    
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
    
    
    console.log('req.body in api', req.body.length);
    for (let i = 0; i < req.body.length; i++) {
        const province = req.body[i].province;
        const value = req.body[i].value;
        const color = req.body[i].color;
        const forecast = req.body[i].forecast;
        const pro_id = req.body[i].pro_id;
        const longitude = req.body[i].longitude;
        const latitude = req.body[i].latitude;
    
        const pollen = await new Pollen({
            province,
            value,
            color,
            forecast,
            pro_id, 
            loc: {
                coordinates: [longitude, latitude],
                type: "Point"
            }
        });
    
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
    }
    
});

router.get("/pollen/:id", async function(req, res, next) {
    const pollenId = req.params.id;
    const data = await Pollen.findById
    (pollenId);
    res.status(200).json({ data });
});

router.put("/update-pollen/:id", function(req, res, next) {
    console.log('req.body', req.body);
    const pollenId = req.params.id;
    const value = req.body.value;
    const color = req.body.color;
    const forecast = req.body.forecast;
    const province = req.body.province;
    const pro_id = req.body.pro_id;
    const loc = req.body.loc;

    
        Pollen
        .findById(pollenId)
        .then(pollen => {
            console.log('pollen', pollen);
            pollen.value = value;
            pollen.color = color;
            pollen.forecast = forecast;
            pollen.province = province;
            pollen.pro_id = pro_id;
            pollen.loc = loc;
            return pollen.save();
        })
        
        .then(result => {
            console.log('Updated Pollen');
            res.status(200).json({ message: 'Success!', data: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
});


module.exports = router;