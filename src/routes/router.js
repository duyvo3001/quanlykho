import jwt from 'jsonwebtoken';
import express from 'express';
import barcode  from '../controllers/barcodeController';
import userController from '../controllers/userController';
import manageController from '../controllers/manageController';
import exportController from '../controllers/exportController';
import reportController from '../controllers/reportController'
import SearchController from '../controllers/SearchController';
import listViewController from '../controllers/listViewController';
import mongoController from '../controllers/mongoController';
const dotenv = require('dotenv');
dotenv.config();
let router = express.Router();

// mideware error handler
const use = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// mideware authentoken handler
const authenToken = (req, res, next) => {
    const token = req.headers['authorization']
    // console.log(req);
    if (!token) return res.status(401).json({message:'k co token'})

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, data) => {
        if (err) {return res.status(401).json({message:'sai token'})}
        next();
    })
}
const initAPIRoute = async (app) => {
    router
        //  ---------------login Controller--------------- 
        .get('/', use(userController.getLoginPage))
        .get('/registerstaff',authenToken, use(userController.register))
        .post('/createstaff',authenToken, use(userController.createUser))
        .post('/signin', use(userController.SignUser))
        //  ---------------BARCODE Controller --------------- 
        .get('/barcodePage/:item?', authenToken, use(barcode.barcodePage))
        
        //  ---------------manage Controller --------------- 
        //  ---------------linhkien -------------------
        .get('/ImportStock/:pageIndex' ,authenToken,use(manageController.getManagePage))
        .post('/PostStock', authenToken, use(manageController.ImportLinhkien))
        .post('/deleteStock/:item', authenToken, use(manageController.deleteStock))
        .get('/editStockPage/:item', authenToken, use(manageController.editStockPage))
        .post('/editStock', authenToken, use(manageController.editStock))
        //  ---------------NCC ------------------------
        .get('/HomeSupplier/:pageIndex', authenToken, use(manageController.getNCCpage))
        .post('/PostSupplier', authenToken, use(manageController.importNCC))
        .post('/deleteSupplier/:item', authenToken, use(manageController.deleteSupplier ))
        .get('/editSupplierPage/:item', authenToken, use(manageController.editSupplierPage))
        .post('/editSupplier', authenToken, use(manageController.editSupplier))
        //  ---------------ThuongHieu -----------------
        .get('/HomeBrand/:pageIndex', authenToken, use(manageController.getThuongHieupage))
        .post('/PostBrand', authenToken, use(manageController.importThuongHieu))
        .post('/deleteBrand/:item', authenToken, use(manageController.deleteBrand))
        .get('/editBrand/:item', authenToken, use(manageController.editBrandPage))
        .post('/editBrand', authenToken, use(manageController.editBrand))
        //  ---------------Dieu Chinh Gia Von -----------------  
        .get('/adjustmentPricePage', authenToken, use(manageController.adjustmentPricePage))
        .post('/adjustmentPrice', authenToken, use(manageController.adjustmentPrice))
            //  ---------------export Controller --------------- 
        .get('/exportPage', authenToken, use(exportController.getExportPage))
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
        .get('/test',function(req ,res){
            return res.json({test : 'abcdefghijklmnopqrstuvwxyz'}) ;
        })
             // ----------------Search----------------------------
             .get('/getuser', authenToken,use(mongoController.getALLusers))
             .post('/postuser',authenToken,use(mongoController.createUsers) )
             .post('/test1',mongoController. getusersInfoByID)
    return app.use("/", router);
}
export default initAPIRoute  
