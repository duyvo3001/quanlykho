import SearchController from '../controllers/SearchController';
export const RouterSearch = (router,authenToken, AccessHandler, use) =>
    router.get('/SearchDateProduct', authenToken, use(SearchController.SearchDateProduct))//read
        .get('/SearchStock', authenToken, use(SearchController.SearchStock))//read
        .get('/SearchCustomer', authenToken, use(SearchController.SearchCustomer))//read
        .get('/SearchStockExport', authenToken, use(SearchController.SearchStockExport))//read
        .get('/SearchBrand', authenToken, use(SearchController.SearchBrand))//read
        .get('/SearchWarehouse', authenToken, use(SearchController.SearchWarehouse))//read
        .get('/SearchSupplier', authenToken, use(SearchController.SearchSupplier))//read
        .get('/SearchInvoice', authenToken, use(SearchController.SearchInvoice))//read
        .get('/SearchUser', authenToken, use(SearchController.SearchUser))//read
        .get('/SearchCategory', authenToken, use(SearchController.SearchCategory))//read