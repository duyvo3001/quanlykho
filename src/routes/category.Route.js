import CategoryController from '../controllers/CategoryController';
export const RouterCategory = (router, authenToken, AccessHandler, use) =>
    router.get('/CategoryPage/:pageIndex', authenToken, use(CategoryController.getCategory))//read
        .post('/importCategory', authenToken, use(CategoryController.ImportCategory))//create