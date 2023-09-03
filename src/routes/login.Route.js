import userController from '../controllers/userController';
export const RouterLogin = (router, authenToken, AccessHandler, use) =>
    router.get('/StaffPage/:pageIndex', authenToken, AccessHandler("User", "read"), use(userController.getStaffPage))//read
        .post('/createstaff', authenToken, AccessHandler("User", "create"), use(userController.createUser))//create
        .post('/deleteUser/:item', authenToken, AccessHandler("User", "delete"), use(userController.deleteUser))//delete
        .patch('/updateUser', authenToken, AccessHandler("User", "update"), use(userController.updateUser))//update
        .post('/signin', use(userController.SignUser))