import manageController from '../controllers/manageController';
export const RouterBrand = (router, authenToken, AccessHandler, use) =>
    router.get('/HomeBrand/:pageIndex', authenToken, AccessHandler("Brand", "read"), use(manageController.getThuongHieupage))//read
        .post('/PostBrand', authenToken, AccessHandler("Brand", "create"), use(manageController.importThuongHieu))//create
        .post('/deleteBrand/:item', authenToken, AccessHandler("Brand", "delete"), use(manageController.deleteBrand))//delete
        .patch('/editBrand', authenToken, AccessHandler("Brand", "update"), use(manageController.editBrand))//update