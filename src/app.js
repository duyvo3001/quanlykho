import express from 'express';
import initAPIRoute from "./routes/router.js"
import inittestAPIRoute from './routes/testrouter.js';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from "body-parser";
import configViewEngine from "./configs/ViewEngine.js";
//session
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;
var path = require('path');
var rfs = require('rotating-file-stream'); // version 2.x

var accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
});
const isProduction = process.env.ENV === 'production';
const app = express();

app.use(cookieParser())
  .use(
    session({
      secret: "some secret",
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 15*60*1000,
        secure: false,
        httpOnly: true
      },
    })
  )
  .use(isProduction ? morgan('combined', { stream: accessLogStream }) : morgan("dev"))
  .use(helmet())// protect nodejs
  .use(cors())
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: true }))
  .use(express.json())

configViewEngine(app);

initAPIRoute(app);

inittestAPIRoute(app);

app
  .use(function(err,req,res,next) {//error handler
    console.log(err);
    res.render("404.ejs", { layout: false })
  })
  .use((req, res) => {// 404 page error
    return res.render("404.ejs", { layout: false });
  })
  .listen(port, () => console.log(`Example app listening on port ${port}`))