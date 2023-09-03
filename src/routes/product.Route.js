import manageController from '../controllers/manageController';
export const RouterProduct = (router,authenToken, AccessHandler, use) =>
    router.get('/ImportStock/:pageIndex', authenToken, AccessHandler("Product", "read"), use(manageController.getManagePage))//read
        .post('/PostStock', authenToken, AccessHandler("Product", "create"), use(manageController.ImportLinhkien))//create
        .post('/deleteStock/:item', authenToken, AccessHandler("Product", "delete"), use(manageController.deleteStock))//delete
        .patch('/editStock', authenToken, AccessHandler("Product", "update"), use(manageController.editStock))//update
        .get('/getProduct/:item', authenToken, AccessHandler("Product", "read"), use(manageController.getProduct))//read