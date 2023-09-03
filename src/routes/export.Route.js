import PaidProductController from '../controllers/PaidProductController';
export const RouterExport = (router, authenToken, AccessHandler, use) =>
    router.post('/PaidOrder', authenToken, AccessHandler("Export", "create"), use(PaidProductController.paidProduct))//create
        .post('/DeleteOrder/:item', authenToken, AccessHandler("Export", "delete"), use(PaidProductController.DeleteOrder))//delete
        .get('/getInvoice/:invoice', authenToken, AccessHandler("Export", "read"), use(PaidProductController.getInvoice))//read
        .get('/HomePaid/:pageIndex', authenToken, AccessHandler("Export", "read"), use(PaidProductController.managePaid))//read