import expressLayouts from "express-ejs-layouts";
import express from 'express';
const configViewEngine = (app)=>{
    app 
    .use(express.static('./dist'))
    .set('dist','./dist')
    //____________________________________________
    .use(express.static('./src/public'))//config để hiển thị public cho ng khác xem
    .set('view engine','ejs')
    .set('views', './src/views')  
    .set('layout', 'layouts/layout')
    .use(expressLayouts)
    

}
export default configViewEngine ;