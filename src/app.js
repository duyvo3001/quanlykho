import express from "express";
import initAPIRoute from "./routes/router.js";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import connectionDBMG from "./configs/connectDBmongo.js";
//session
import 'dotenv/config'

const port = process.env.PORT || 3000;

const isProduction = process.env.ENV === "production";
const app = express();

// boot server
app.use(function (req, res, next) {

  // Website you wish to allow to w
  res.setHeader('Access-Control-Allow-Origin','*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

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
        ? morgan("combined")
        : morgan("dev")
    )
    .use(helmet()) // protect nodejs
    .use(cors(
      {
        origin: [process.env.UrlWebClient],
        optionsSuccessStatus: 200
      }
    ))
    .use(bodyParser.json())
    .use(express.urlencoded({ extended: true }))
    .use(express.json());

  initAPIRoute(app);

  app
    .use(function (err, req, res, next) {
      res.status(500).json({ message: false });//error handler
    })
    .use((req, res, err) => {
      res.status(500)// 404 page error
    })
    .listen(port, () => console.log(`Example app listening on port ${port}`));
};
