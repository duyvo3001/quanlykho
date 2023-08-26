import jwt from 'jsonwebtoken';
import express from 'express';
import userController from '../controllers/userController';
import manageController from '../controllers/manageController';
import reportController from '../controllers/reportController'
import SearchController from '../controllers/SearchController';
import CustomerController from '../controllers/CustomerController';
import WareHouseController from '../controllers/WareHouseController';
import PaidProductController from '../controllers/PaidProductController';
import CategoryController from '../controllers/CategoryController';
import DashBoardController from '../controllers/DashboardController';
import {use ,authenToken} from "../middleware/JwtAction"
const dotenv = require('dotenv');
dotenv.config();
let router = express.Router();

const initAPIRoute = async (app) => {
    router
        //-----------------WareHouse Controller----------------
        .get('/WareHousePage/:pageIndex', authenToken, use(WareHouseController.getWarehousePage))
        .post('/importWarehouse', authenToken, use(WareHouseController.importWarehouse))
        .patch('/UpdateWarehouse', authenToken, use(WareHouseController.editWarehouse))
        .post('/deleteWarehouse/:item', authenToken, use(WareHouseController.deleteWarehouse))
        //-----------------WareHouse Controller----------------
        .get('/CategoryPage/:pageIndex', authenToken, use(CategoryController.getCategory))
        .post('/importCategory', authenToken, use(CategoryController.ImportCategory))
        //-----------------Customer Controller----------------
        .get('/CustomerPage/:pageIndex', authenToken, use(CustomerController.CustomerPage))
        .post('/ImportCustomer', authenToken, use(CustomerController.importCustomer))
        .patch('/UpdateCustomer', authenToken, use(CustomerController.UpdateCustomer))
        .post('/DeleteCustomer/:item', authenToken, use(CustomerController.DeleteCustomer))
        .get('/infoCustomer/:item', authenToken, use(CustomerController.infoCustomer))
        //  ---------------login Controller--------------- 
        .get('/StaffPage/:pageIndex', authenToken, use(userController.getStaffPage))
        .post('/createstaff', authenToken, use(userController.createUser))
        .post('/deleteUser/:item', authenToken, use(userController.deleteUser))
        .patch('/updateUser', authenToken, use(userController.updateUser))
        .post('/signin', use(userController.SignUser))
        // ----------------Export Order----------------------------------
        .post('/PaidOrder', authenToken, use(PaidProductController.paidProduct))
        .post('/DeleteOrder/:item', authenToken, use(PaidProductController.DeleteOrder))
        .get('/getInvoice/:invoice', authenToken, use(PaidProductController.getInvoice))
        .get('/HomePaid/:pageIndex', authenToken, use(PaidProductController.managePaid))
        //  ---------------manage Controller --------------- 
        //  ---------------linhkien -------------------
        .get('/ImportStock/:pageIndex', authenToken, use(manageController.getManagePage))
        .post('/PostStock', authenToken, use(manageController.ImportLinhkien))
        .post('/deleteStock/:item', authenToken, use(manageController.deleteStock))
        .patch('/editStock', authenToken, use(manageController.editStock))
        .patch('/AddProduct', authenToken, use(manageController.AddProduct))

        .get('/getProduct/:item', authenToken, use(manageController.getProduct))
        //  ---------------NCC ------------------------
        .get('/HomeSupplier/:pageIndex', authenToken, use(manageController.getNCCpage))
        .post('/PostSupplier', authenToken, use(manageController.importNCC))
        .post('/deleteSupplier/:item', authenToken, use(manageController.deleteSupplier))
        .patch('/editSupplier', authenToken, use(manageController.editSupplier))
        //  ---------------ThuongHieu -----------------
        .get('/HomeBrand/:pageIndex', authenToken, use(manageController.getThuongHieupage))
        .post('/PostBrand', authenToken, use(manageController.importThuongHieu))
        .post('/deleteBrand/:item', authenToken, use(manageController.deleteBrand))
        .patch('/editBrand', authenToken, use(manageController.editBrand))

        //  ---------------report Controller --------------- 
        .post('/inventoryReport', use(reportController.getInventoryReport))
        .post('/OutofStock', use(reportController.getOutofStock))
        .get('/SaleReport/:year', use(reportController.getSaleReport))
        .get('/CategoryReport/:year', use(reportController.CategoryReport))
        .get('/BrandReport/:year', use(reportController.BrandReport))
        // ----------------Search----------------------------
        .get('/SearchDateProduct', use(SearchController.SearchDateProduct))
        .get('/SearchStock', authenToken, use(SearchController.SearchStock))
        .get('/SearchCustomer', authenToken, use(SearchController.SearchCustomer))
        .get('/SearchStockExport', authenToken, use(SearchController.SearchStockExport))
        .get('/SearchBrand', authenToken, use(SearchController.SearchBrand))
        .get('/SearchWarehouse', authenToken, use(SearchController.SearchWarehouse))
        .get('/SearchSupplier', authenToken, use(SearchController.SearchSupplier))
        .get('/SearchInvoice', authenToken, use(SearchController.SearchInvoice))
        .get('/SearchUser', authenToken, use(SearchController.SearchUser))
        .get('/SearchCategory', authenToken, use(SearchController.SearchCategory))
        // ----------------Dash----------------------------
        .get('/Dashboard', authenToken, use(DashBoardController.DashBoard))

    return app.use("/", router);
}
export default initAPIRoute  
