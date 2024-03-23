require('dotenv').config();
const sequelize = require('./connection/connect');
require('./configuration/db-config').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const https = require('https');

const routerConfig = require('./configuration/router-config');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
// const helmet = require('helmet');


const app = express();
const upload = multer();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { 'flags': 'a' });

// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));
// app.use(helmet());
app.use('/css', express.static(path.join(__dirname, "/node_modules/bootstrap/dist/css")));
app.use('/js', express.static(path.join(__dirname, "/node_modules/bootstrap/dist/js")));
app.use('/fonts', express.static(path.join(__dirname, "/node_modules/bootstrap-icons/font")));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
app.use(upload.none());

routerConfig.config(app);

(async () => {
    try {
        await sequelize.sync();
        // https.createServer({key : privateKey, cert : certificate},app)
        app.listen(process.env.PORT || 3000);
    } catch (error) {
        console.log(error);
    }
})();
