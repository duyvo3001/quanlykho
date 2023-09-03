import manageController from '../controllers/manageController';
export const RouterSupplier = (router,authenToken, AccessHandler, use) =>
    router.get('/HomeSupplier/:pageIndex', AccessHandler("Supllier", "read"), authenToken, use(manageController.getNCCpage))//read
        .post('/PostSupplier', authenToken, AccessHandler("Supllier", "create"), use(manageController.importNCC))//create
        .post('/deleteSupplier/:item', authenToken, AccessHandler("WareSupllierhouse", "delete"), use(manageController.deleteSupplier))//delete
        .patch('/editSupplier', authenToken, AccessHandler("Supllier", "update"), use(manageController.editSupplier))//update