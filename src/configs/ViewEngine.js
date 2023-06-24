
import express from 'express';
const configViewEngine = (app)=>{
    app 
    .use(express.static('./dist'))
    .set('dist','./dist')
}
export default configViewEngine ;