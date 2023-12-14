const FieldColor=require('../models/model_FieldColor')
exports.getFieldsColors = async (req, res, next) => {
    // console.log("here in fields controller")
    const data = await FieldColor.find();
    return res.status(200).json(data)
};
exports.addFieldsColors = async (req, res, next) => {
    try {
        const type = req.body.type;
        const color = req.body.color;

        const fieldColor = await new FieldColor({
            type,
            color
        });

        fieldColor
            .save()
            .then(results => {
                res.status(200).json("success");
            })
            .catch(error => {
                console.error('Error saving field color:', error);
                res.status(500).json('Internal Server Error');
            });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json('Internal Server Error');
    }
};
