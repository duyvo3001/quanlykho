import jwt from 'jsonwebtoken';
import express from 'express';
import userController from '../controllers/userController';
import manageController from '../controllers/manageController';
import exportController from '../controllers/exportController';
import reportController from '../controllers/reportController'
import SearchController from '../controllers/SearchController';
import listViewController from '../controllers/listViewController';
import { result } from '../services/renderdataHang';
const dotenv = require('dotenv');
dotenv.config();
let router = express.Router();

// mideware error handler
const use = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// mideware authentoken handler
const authenToken = (req, res, next) => {
    const token = req.cookies.access_token
    if (!token) return res.render('refreshlogin.ejs',{layout : false})

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, data) => {
        if (err) {return res.render('refreshlogin.ejs',{layout : false})}
        next();
    })
}
const initAPIRoute = async (app) => {
    router
        //  ---------------login Controller--------------- 
        .get('/', use(userController.getLoginPage))
        .get('/registerstaff', use(userController.register))
        .post('/createstaff', use(userController.createUser))
        .post('/signin', use(userController.SignUser))
        
        //  ---------------manage Controller --------------- 
        //  ---------------linhkien -------------------
        .get('/homeLinhKien', authenToken, use(manageController.getManagePage))
        .post('/Postpartskit', authenToken, use(manageController.importLinhKien))
        .post('/deleteItemLinhkien/:item', authenToken, use(manageController.deleteItem))
        .get('/editItemLinhkienPage/:item', authenToken, use(manageController.editItemLinhKienPage))
        .post('/editItemLinhkien', authenToken, use(manageController.editItemLinhKien))
        //  ---------------NCC ------------------------
        .get('/homeNCC', authenToken, use(manageController.getNCCpage))
        .post('/PostNCC', authenToken, use(manageController.importNCC))
        .post('/deleteItemNCC/:item', authenToken, use(manageController.deleteItemNCC))
        .get('/editItemNCCPage/:item', authenToken, use(manageController.editItemNCCPage))
        .post('/editItemNCC', authenToken, use(manageController.editItemNCC))
        //  ---------------ThuongHieu -----------------
        .get('/homeThuongHieu', authenToken, use(manageController.getThuongHieupage))
        .post('/PostThuongHieu', authenToken, use(manageController.importThuongHieu))
        .post('/deleteItemThuongHieu/:item', authenToken, use(manageController.deleteItemThuongHieu))
        .get('/editItemThuongHieuPage/:item', authenToken, use(manageController.editItemThuongHieuPage))
        .post('/editItemThuongHieu', authenToken, use(manageController.editItemThuongHieu))
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
        .post('/SearchLinhKien', authenToken, use(SearchController.SearchLinhKien))
        .post('/SearchNCC', authenToken, use(SearchController.SearchNCC))
        .post('/SearchThuongHieu', authenToken, use(SearchController.SearchThuongHieu))

        .get('/listLinhKien', authenToken, use(listViewController.viewListPage))
        .get('/test',function(req ,res){
            return res.json({test : 'abcdefghijklmnopqrstuvwxyz'}) ;
        })
    return app.use("/", router);
}
export default initAPIRoute  
