import CustomerController from '../controllers/CustomerController';
export const RouterCustomer = (router, authenToken, AccessHandler, use) =>
    router
        .get('/CustomerPage/:pageIndex', authenToken, AccessHandler("Customer", "read"), use(CustomerController.CustomerPage))//read
        .post('/ImportCustomer', authenToken, AccessHandler("Customer", "create"), use(CustomerController.importCustomer))//create
        .patch('/UpdateCustomer', authenToken, AccessHandler("Customer", "update"), use(CustomerController.UpdateCustomer))//update
        .post('/DeleteCustomer/:item', authenToken, AccessHandler("Customer", "delete"), use(CustomerController.DeleteCustomer))//delete
        .get('/infoCustomer/:item', authenToken, AccessHandler("Customer", "read"), use(CustomerController.infoCustomer))//read