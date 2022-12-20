import express from 'express';
let router = express.Router();
const inittestAPIRoute = async (app) => {
    router 
    //  ---------------test cookie --------------- 
    .get('/set', (req, res) => {
        res.cookie('test1', 'data1', {
            httpOnly: true
        }).cookie('test2', 'data2', {
            httpOnly: true,
            secure: true
        })
        res.send('set cookie')
    })
    .get('/get', (req, res) => {
        const cookies = req.cookies;

        res.send(cookies);
    })
    //  ---------------test cookie --------------- 
    .get('/get_session', (req, res) => {
        // console.log( Object.values(req.session)[2]);// count session
        if(!req.session){console.log('check1')}else{console.log('check2')}
        res.send('check kk');
    })
    .get('/set_session', (req, res) => {
       req.session[`id${Object.keys(req.session).length}`]={
        malk : 'hello',
        malk1 : 'world'
       }
        res.send('set oke');
    })
    return app.use("/", router);

}
export default inittestAPIRoute