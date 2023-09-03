import reportController from '../controllers/reportController'
export const RouterReport = () =>
    router.post('/inventoryReport', use(reportController.getInventoryReport))//read
        .post('/OutofStock', use(reportController.getOutofStock))//read
        .get('/SaleReport/:year', use(reportController.getSaleReport))//read
        .get('/CategoryReport/:year', use(reportController.CategoryReport))//read
        .get('/BrandReport/:year', use(reportController.BrandReport))//read