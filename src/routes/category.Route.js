import CategoryController from '../controllers/CategoryController';
export const RouterCategory = (router, authenToken, AccessHandler, use) =>
    router
        .get('/CategoryPage/:pageIndex', authenToken, use(CategoryController.getCategory))//read
        .post('/importCategory', authenToken, use(CategoryController.ImportCategory))//create
        .patch('/updateCategory', authenToken, use(CategoryController.editCategory))//create
        .post('/deleteCategory/:item', authenToken, use(CategoryController.deleteCategory))//create