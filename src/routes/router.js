import jwt from 'jsonwebtoken';
import express from 'express';
import barcode from '../controllers/barcodeController';
import userController from '../controllers/userController';
import manageController from '../controllers/manageController';
import exportController from '../controllers/exportController';
import reportController from '../controllers/reportController'
import SearchController from '../controllers/SearchController';
import listViewController from '../controllers/listViewController';
import mongoController from '../controllers/mongoController';
import CustomerController from '../controllers/CustomerController';
import WareHouseController from '../controllers/WareHouseController';
import PaidProductController from '../controllers/PaidProductController';
const dotenv = require('dotenv');
dotenv.config();
let router = express.Router();

// mideware error handler
const use = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// mideware authentoken handler
const authenToken = (req, res, next) => {
    const token = req.headers['authorization']

    if (!token) return res.status(401).json({ message: 'k co token' })

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, data) => {
        if (err) { return res.status(401).json({ message: 'sai token' }) }
        next();
    })
}
const initAPIRoute = async (app) => {
    router
        //-----------------WareHouse Controller----------------
        .get('/WareHousePage/:pageIndex', authenToken, use(WareHouseController.getWarehousePage))
        .post('/importWarehouse', authenToken, use(WareHouseController.importWarehouse))
        .patch('/UpdateWarehouse', authenToken, use(WareHouseController.editWarehouse))
        .post('/deleteWarehouse/:item', authenToken, use(WareHouseController.deleteWarehouse))
        //-----------------Customer Controller----------------
        .get('/CustomerPage/:pageIndex', authenToken, use(CustomerController.CustomerPage))
        .post('/ImportCustomer', authenToken, use(CustomerController.importCustomer))
        .patch('/UpdateCustomer', authenToken, use(CustomerController.UpdateCustomer))
        .post('/DeleteCustomer/:item', authenToken, use(CustomerController.DeleteCustomer))
        //  ---------------login Controller--------------- 
        .get('/StaffPage/:pageIndex', authenToken, use(userController.getStaffPage))
        .get('/registerstaff', authenToken, use(userController.register))
        .post('/createstaff', authenToken, use(userController.createUser))
        .post('/signin', use(userController.SignUser))
        //  ---------------BARCODE Controller --------------- 
        .get('/barcodePage/:item?', authenToken, use(barcode.barcodePage))
        // ----------------Paid Order----------------------------------
        .post('/PaidOrder', authenToken, use(PaidProductController.paidProduct))
        .get('/HomePaid/:pageIndex', authenToken, use(PaidProductController.managePaid))
        //  ---------------manage Controller --------------- 
        //  ---------------linhkien -------------------
        .get('/ImportStock/:pageIndex', authenToken, use(manageController.getManagePage))
        .post('/PostStock', authenToken, use(manageController.ImportLinhkien))
        .post('/deleteStock/:item', authenToken, use(manageController.deleteStock))
        .patch('/editStock', authenToken, use(manageController.editStock))
        //  ---------------NCC ------------------------
        .get('/HomeSupplier/:pageIndex', authenToken, use(manageController.getNCCpage))
        .post('/PostSupplier', authenToken, use(manageController.importNCC))
        .post('/deleteSupplier/:item', authenToken, use(manageController.deleteSupplier))
        .get('/editSupplierPage/:item', authenToken, use(manageController.editSupplierPage))
        .patch('/editSupplier', authenToken, use(manageController.editSupplier))
        //  ---------------ThuongHieu -----------------
        .get('/HomeBrand/:pageIndex', authenToken, use(manageController.getThuongHieupage))
        .post('/PostBrand', authenToken, use(manageController.importThuongHieu))
        .post('/deleteBrand/:item', authenToken, use(manageController.deleteBrand))
        .patch('/editBrand', authenToken, use(manageController.editBrand))
        //  ---------------Dieu Chinh Gia Von -----------------  
        .get('/adjustmentPricePage', authenToken, use(manageController.adjustmentPricePage))
        .post('/adjustmentPrice', authenToken, use(manageController.adjustmentPrice))
        //  ---------------export Controller --------------- 
        .get('/SearchStockExport', authenToken, use(exportController.SearchStock))
        .get('/SearchCustomer', authenToken, use(exportController.SearchCustomer))
        .get('/exportPage', use(exportController.getExportPage))
        .get('/getPageExportfile', authenToken, use(exportController.getPageExportfile))
        .post('/exportfile', authenToken, use(exportController.Exportfile))
        .post('/getID', authenToken, use(exportController.getID))
        //  ---------------report Controller --------------- 
        .get('/ReportPage', use(reportController.getReportPage))
        // ----------------Search----------------------------
        .post('/SearchStock', authenToken, use(SearchController.SearchStock))
        .post('/SearchSupplier', authenToken, use(SearchController.SearchSupplier))
        .post('/SearchBrand', authenToken, use(SearchController.SearchBrand))

        .get('/listLinhKien', authenToken, use(listViewController.viewListPage))
        .get('/test', function (req, res) {
            return res.json({ test: 'abcdefghijklmnopqrstuvwxyz' });
        })
        // ----------------Search----------------------------
        .get('/getuser', authenToken, use(mongoController.getALLusers))
        .post('/postuser', authenToken, use(mongoController.createUsers))
        .post('/test1', mongoController.getusersInfoByID)
    return app.use("/", router);
}
export default initAPIRoute  
