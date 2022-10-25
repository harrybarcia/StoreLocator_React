const multer = require("multer");
const path = require("path"); 
// Multer config
const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'public/images');
    },
    filename:(req,file,cb)=>{
        cb(null, file.originalname);
    }
});
module.exports = fileStorage;

