require('dotenv').config();
const {connectDB} = require('./connection/connect');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const routerConfig = require('./configuration/router-config');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');

const app = express();
const upload = multer();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { 'flags': 'a' });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));
app.use('/css', express.static(path.join(__dirname, "/node_modules/bootstrap/dist/css")));
app.use('/js', express.static(path.join(__dirname, "/node_modules/bootstrap/dist/js")));
app.use('/fonts', express.static(path.join(__dirname, "/node_modules/bootstrap-icons/font")));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
app.use(upload.none());

routerConfig.config(app);

connectDB(()=>{
    console.clear();
    app.listen(3000, (err)=>{
        if(err)
            console.log(err);
        console.log("Server started");
    })
});