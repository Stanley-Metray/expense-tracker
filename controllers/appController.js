const path = require('path');

module.exports.getHome = (req,res)=>{
    res.sendFile(path.join(__dirname, "../views", "index.html"));
}