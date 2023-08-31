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
import { use, authenToken } from "../middleware/JwtAction"
const dotenv = require('dotenv');
dotenv.config();
let router = express.Router();

const initAPIRoute = async (app) => {
    router
        //-----------------WareHouse Controller----------------
        .get('/WareHousePage/:pageIndex', authenToken, use(WareHouseController.getWarehousePage))//read
        .post('/importWarehouse', authenToken, use(WareHouseController.importWarehouse))//create
        .patch('/UpdateWarehouse', authenToken, use(WareHouseController.editWarehouse))//update
        .post('/deleteWarehouse/:item', authenToken, use(WareHouseController.deleteWarehouse))//delete
        //-----------------WareHouse Controller----------------
        .get('/CategoryPage/:pageIndex', authenToken, use(CategoryController.getCategory))//read
        .post('/importCategory', authenToken, use(CategoryController.ImportCategory))//create
        //-----------------Customer Controller----------------
        .get('/CustomerPage/:pageIndex', authenToken, use(CustomerController.CustomerPage))//read
        .post('/ImportCustomer', authenToken, use(CustomerController.importCustomer))//create
        .patch('/UpdateCustomer', authenToken, use(CustomerController.UpdateCustomer))//update
        .post('/DeleteCustomer/:item', authenToken, use(CustomerController.DeleteCustomer))//delete
        .get('/infoCustomer/:item', authenToken, use(CustomerController.infoCustomer))//read
        //  ---------------login Controller--------------- 
        .get('/StaffPage/:pageIndex', authenToken, use(userController.getStaffPage))//read
        .post('/createstaff', authenToken, use(userController.createUser))//create
        .post('/deleteUser/:item', authenToken, use(userController.deleteUser))//delete//delete
        .patch('/updateUser', authenToken, use(userController.updateUser))//update
        .post('/signin', use(userController.SignUser))
        // ----------------Export Order----------------------------------
        .post('/PaidOrder', authenToken, use(PaidProductController.paidProduct))//create
        .post('/DeleteOrder/:item', authenToken, use(PaidProductController.DeleteOrder))//delete
        .get('/getInvoice/:invoice', authenToken, use(PaidProductController.getInvoice))//read
        .get('/HomePaid/:pageIndex', authenToken, use(PaidProductController.managePaid))//read
        //  ---------------manage Controller --------------- 
        //  ---------------linhkien -------------------
        .get('/ImportStock/:pageIndex', authenToken, use(manageController.getManagePage))//read
        .post('/PostStock', authenToken, use(manageController.ImportLinhkien))//create
        .post('/deleteStock/:item', authenToken, use(manageController.deleteStock))
        .patch('/editStock', authenToken, use(manageController.editStock))//update
        .patch('/AddProduct', authenToken, use(manageController.AddProduct))//create
        .get('/getProduct/:item', authenToken, use(manageController.getProduct))//read
        //  ---------------NCC ------------------------
        .get('/HomeSupplier/:pageIndex', authenToken, use(manageController.getNCCpage))//read
        .post('/PostSupplier', authenToken, use(manageController.importNCC))//create
        .post('/deleteSupplier/:item', authenToken, use(manageController.deleteSupplier))//delete
        .patch('/editSupplier', authenToken, use(manageController.editSupplier))//update
        //  ---------------ThuongHieu -----------------
        .get('/HomeBrand/:pageIndex', authenToken, use(manageController.getThuongHieupage))//read
        .post('/PostBrand', authenToken, use(manageController.importThuongHieu))//create
        .post('/deleteBrand/:item', authenToken, use(manageController.deleteBrand))//delete
        .patch('/editBrand', authenToken, use(manageController.editBrand))//update

        //  ---------------report Controller --------------- 
        .post('/inventoryReport', use(reportController.getInventoryReport))//read
        .post('/OutofStock', use(reportController.getOutofStock))//read
        .get('/SaleReport/:year', use(reportController.getSaleReport))//read
        .get('/CategoryReport/:year', use(reportController.CategoryReport))//read
        .get('/BrandReport/:year', use(reportController.BrandReport))//read
        // ----------------Search----------------------------
        .get('/SearchDateProduct', use(SearchController.SearchDateProduct))//read
        .get('/SearchStock', authenToken, use(SearchController.SearchStock))//read
        .get('/SearchCustomer', authenToken, use(SearchController.SearchCustomer))//read
        .get('/SearchStockExport', authenToken, use(SearchController.SearchStockExport))//read
        .get('/SearchBrand', authenToken, use(SearchController.SearchBrand))//read
        .get('/SearchWarehouse', authenToken, use(SearchController.SearchWarehouse))//read
        .get('/SearchSupplier', authenToken, use(SearchController.SearchSupplier))//read
        .get('/SearchInvoice', authenToken, use(SearchController.SearchInvoice))//read
        .get('/SearchUser', authenToken, use(SearchController.SearchUser))//read
        .get('/SearchCategory', authenToken, use(SearchController.SearchCategory))//read
        // ----------------Dash----------------------------
        .get('/Dashboard', authenToken, use(DashBoardController.DashBoard))//read

    return app.use("/", router);
}
export default initAPIRoute  
