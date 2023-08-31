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
import { use, authenToken, AccessHandler } from "../middleware/JwtAction"
const dotenv = require('dotenv');
dotenv.config();
let router = express.Router();

const initAPIRoute = async (app) => {
    router
        // ----------------Dash----------------------------
        .get('/Dashboard', authenToken, use(DashBoardController.DashBoard))//read
        //-----------------WareHouse Controller----------------
        .get('/WareHousePage/:pageIndex', authenToken, AccessHandler("Warehouse", "read"), use(WareHouseController.getWarehousePage))//read
        .post('/importWarehouse', authenToken, AccessHandler("Warehouse", "create"), use(WareHouseController.importWarehouse))//create
        .patch('/UpdateWarehouse', authenToken, AccessHandler("Warehouse", "update"), use(WareHouseController.editWarehouse))//update
        .post('/deleteWarehouse/:item', authenToken, AccessHandler("Warehouse", "delete"), use(WareHouseController.deleteWarehouse))//delete
        //-----------------CategoryPage Controller----------------
        .get('/CategoryPage/:pageIndex', authenToken, use(CategoryController.getCategory))//read
        .post('/importCategory', authenToken, use(CategoryController.ImportCategory))//create
        //-----------------Customer Controller----------------
        .get('/CustomerPage/:pageIndex', authenToken, AccessHandler("Customer", "read"), use(CustomerController.CustomerPage))//read
        .post('/ImportCustomer', authenToken, AccessHandler("Customer", "create"), use(CustomerController.importCustomer))//create
        .patch('/UpdateCustomer', authenToken, AccessHandler("Customer", "update"), use(CustomerController.UpdateCustomer))//update
        .post('/DeleteCustomer/:item', authenToken, AccessHandler("Customer", "delete"), use(CustomerController.DeleteCustomer))//delete
        .get('/infoCustomer/:item', authenToken, AccessHandler("Customer", "read"), use(CustomerController.infoCustomer))//read
        //  ---------------login Controller--------------- 
        .get('/StaffPage/:pageIndex', authenToken, AccessHandler("User", "read"), use(userController.getStaffPage))//read
        .post('/createstaff', authenToken, AccessHandler("User", "create"), use(userController.createUser))//create
        .post('/deleteUser/:item', authenToken, AccessHandler("User", "delete"), use(userController.deleteUser))//delete
        .patch('/updateUser', authenToken, AccessHandler("User", "update"), use(userController.updateUser))//update
        .post('/signin', use(userController.SignUser))
        // ----------------Export Order----------------------------------
        .post('/PaidOrder', authenToken, AccessHandler("Export", "create"), use(PaidProductController.paidProduct))//create
        .post('/DeleteOrder/:item', authenToken, AccessHandler("Export", "delete"), use(PaidProductController.DeleteOrder))//delete
        .get('/getInvoice/:invoice', authenToken, AccessHandler("Export", "read"), use(PaidProductController.getInvoice))//read
        .get('/HomePaid/:pageIndex', authenToken, AccessHandler("Export", "read"), use(PaidProductController.managePaid))//read
        //  ---------------manage Controller --------------- 
        //  ---------------linhkien -------------------
        .get('/ImportStock/:pageIndex', authenToken, AccessHandler("Product", "read"), use(manageController.getManagePage))//read
        .post('/PostStock', authenToken, AccessHandler("Product", "create"), use(manageController.ImportLinhkien))//create
        .post('/deleteStock/:item', authenToken, AccessHandler("Product", "delete"), use(manageController.deleteStock))//delete
        .patch('/editStock', authenToken, AccessHandler("Product", "update"), use(manageController.editStock))//update
        // .patch('/AddProduct', authenToken, AccessHandler("Product", "read"), use(manageController.AddProduct))//create
        .get('/getProduct/:item', authenToken, AccessHandler("Product", "read"), use(manageController.getProduct))//read
        //  ---------------NCC ------------------------
        .get('/HomeSupplier/:pageIndex', AccessHandler("Supllier", "read"), authenToken, use(manageController.getNCCpage))//read
        .post('/PostSupplier', authenToken, AccessHandler("Supllier", "create"), use(manageController.importNCC))//create
        .post('/deleteSupplier/:item', authenToken, AccessHandler("WareSupllierhouse", "delete"), use(manageController.deleteSupplier))//delete
        .patch('/editSupplier', authenToken, AccessHandler("Supllier", "update"), use(manageController.editSupplier))//update
        //  ---------------ThuongHieu -----------------
        .get('/HomeBrand/:pageIndex', authenToken, AccessHandler("Brand", "read"), use(manageController.getThuongHieupage))//read
        .post('/PostBrand', authenToken, AccessHandler("Brand", "create"), use(manageController.importThuongHieu))//create
        .post('/deleteBrand/:item', authenToken, AccessHandler("Brand", "delete"), use(manageController.deleteBrand))//delete
        .patch('/editBrand', authenToken, AccessHandler("Brand", "update"), use(manageController.editBrand))//update

        //  ---------------report Controller --------------- 
        .post('/inventoryReport', use(reportController.getInventoryReport))//read
        .post('/OutofStock', use(reportController.getOutofStock))//read
        .get('/SaleReport/:year', use(reportController.getSaleReport))//read
        .get('/CategoryReport/:year', use(reportController.CategoryReport))//read
        .get('/BrandReport/:year', use(reportController.BrandReport))//read
        // ----------------Search----------------------------
        .get('/SearchDateProduct', authenToken, use(SearchController.SearchDateProduct))//read
        .get('/SearchStock', authenToken, use(SearchController.SearchStock))//read
        .get('/SearchCustomer', authenToken, use(SearchController.SearchCustomer))//read
        .get('/SearchStockExport', authenToken, use(SearchController.SearchStockExport))//read
        .get('/SearchBrand', authenToken, use(SearchController.SearchBrand))//read
        .get('/SearchWarehouse', authenToken, use(SearchController.SearchWarehouse))//read
        .get('/SearchSupplier', authenToken, use(SearchController.SearchSupplier))//read
        .get('/SearchInvoice', authenToken, use(SearchController.SearchInvoice))//read
        .get('/SearchUser', authenToken, use(SearchController.SearchUser))//read
        .get('/SearchCategory', authenToken, use(SearchController.SearchCategory))//read
    return app.use("/", router);
}
export default initAPIRoute  
