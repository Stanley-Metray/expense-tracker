const jwt = require('jsonwebtoken');
const path = require("path");



module.exports.generateToken = async (user) => {
    const payload = {
        id: user.id,
        email: user.email
    }
    const token = jwt.sign(payload, process.env.JWT_SECRETE_KEY, { expiresIn: '24h' });
    return token;
}

module.exports.verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
   
    if (!token)
        return res.sendFile(path.join(__dirname, "../views", "authError.html"));

    jwt.verify(token, process.env.JWT_SECRETE_KEY, (err, decoded) => {
        if (err)
        {
            console.log(err);
            return res.sendFile(path.join(__dirname, "../views", "authError.html"));
        }
        req.body.UserId = decoded.id;
        next();
    });
}


