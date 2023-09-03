import WareHouseController from '../controllers/WareHouseController';
export const RouterWareHouse = (router, authenToken, AccessHandler, use) =>
    router.get('/WareHousePage/:pageIndex', authenToken, AccessHandler("Warehouse", "read"), use(WareHouseController.getWarehousePage))//read
        .post('/importWarehouse', authenToken, AccessHandler("Warehouse", "create"), use(WareHouseController.importWarehouse))//create
        .patch('/UpdateWarehouse', authenToken, AccessHandler("Warehouse", "update"), use(WareHouseController.editWarehouse))//update
        .post('/deleteWarehouse/:item', authenToken, AccessHandler("Warehouse", "delete"), use(WareHouseController.deleteWarehouse))//delete