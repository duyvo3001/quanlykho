import express from 'express';
import DashBoardController from '../controllers/DashboardController';
import { authenToken, AccessHandler } from "../middleware/JwtAction"
import { RouterWareHouse } from './warehouse.Route';
import { RouterCategory } from './category.Route';
import { RouterCustomer } from './customer.Route';
import { RouterLogin } from './login.Route';
import { RouterExport } from './export.Route';
import { RouterProduct } from './product.Route';
import { RouterSearch } from './search.Route';
import { RouterSupplier } from './supplier.Route';
import { RouterBrand } from './brand.Route';
import { RouterReport } from './report.Route';
const dotenv = require('dotenv');
dotenv.config();
let router = express.Router();

const use = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

const DashBoard = router.get('/Dashboard', authenToken, use(DashBoardController.DashBoard))//read

const initAPIRoute = async (app) => {
    DashBoard
    RouterWareHouse(router, authenToken, AccessHandler, use)
    RouterCategory(router, authenToken, AccessHandler, use)
    RouterCustomer(router, authenToken, AccessHandler, use)
    RouterLogin(router, authenToken, AccessHandler, use)
    RouterExport(router, authenToken, AccessHandler, use)
    RouterProduct(router, authenToken, AccessHandler, use)
    RouterSearch(router, authenToken, AccessHandler, use)
    RouterSupplier(router, authenToken, AccessHandler, use)
    RouterBrand(router, authenToken, AccessHandler, use)
    RouterReport(router, authenToken, AccessHandler, use)
    return app.use("/", router);
}
export default initAPIRoute  
