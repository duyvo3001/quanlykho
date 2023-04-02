import express from "express";
import initAPIRoute from "./routes/router.js";
import inittestAPIRoute from "./routes/testrouter.js";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import configViewEngine from "./configs/ViewEngine.js";
import connectionDBMG from "./configs/connectDBmongo.js";
//session
const session = require("express-session");
const cookieParser = require("cookie-parser");

const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 3000;
let path = require("path");
let rfs = require("rotating-file-stream"); // version 2.x

let accessLogStream = rfs.createStream("access.log", {
  size: "10M",
  interval: "1d",
  compress: "gzip",
});
const isProduction = process.env.ENV === "production";
const app = express();
// boot server
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
connectionDBMG
  .connectMGDB(process.env.MONGO_URL)
  .then(() => console.log("connec db successfully"))
  .then(() => bootserver())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const bootserver = () => {
  app
    .use(
      isProduction
        ? morgan("combined", { stream: accessLogStream })
        : morgan("dev")
    )
    .use(helmet()) // protect nodejs
    .use(cors(
      {
        origin: ["http://localhost:3000"] ,
        optionsSuccessStatus: 200
      }
    ))
    .use(bodyParser.json())
    .use(express.urlencoded({ extended: true }))
    .use(express.json());

  configViewEngine(app);

  initAPIRoute(app);

  inittestAPIRoute(app);

  app
    .use(function (err, req, res, next) {
      //error handler
      console.log(err);
      res.render("404.ejs", { layout: false });
    })
    .use((req, res) => {
      // 404 page error
      return res.render("404.ejs", { layout: false });
    })
    .listen(port, () => console.log(`Example app listening on port ${port}`));
};
