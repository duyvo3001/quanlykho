import data from "../services/renderdataHang";
import connec from '../configs/connectDBmongo.js'
import { checkfunc } from '../services/checkData';
const searchfunc = (search) => {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (format.test(search)) {
      return true;
    } else {
      return false;
    }
  }
//check special characters
const CheckSpecialCharacters = (arrData) => {
    let checkArr = checkfunc(arrData)
    if (checkArr.length > 0) { return checkArr }
    else return false;

}
const CheckDataHang = () => {

}
const SearchStock = async (req, res) => {
    const datarender = await connec.getDB().collection('Hang').find({}).toArray()
    return res.status(200).json({ result: datarender })
}
//
const SearchCustomer = async (req, res) => {
    const datarender = await connec.getDB().collection('Customer').find({}).toArray()   
    return res.status(200).json({ result: datarender })
  }
let getExportPage = async (req, res) => {
    let arrayResult = [];
    let objResult = [];
    let lengthSessions = Object.keys(req.session).length;

    return res.render('exportpage.ejs', { result: await data.result('Hang', 'renderDatanull', '') })
    // if (lengthSessions == 1) {
    // }
    //  kiem tra bao nhieu session
    // else {
    //     for (let i = 0; i < lengthSessions; i++) {
    //         objResult.push(await data.result('Hang', 'renderdataExport', req.session[`id${i + 1}`]?.['MaLK']));
    //         if (objResult[i][0] != undefined)
    //             arrayResult.push(objResult[i][0])
    //     }

    //     res.render('exportpage.ejs', { result: arrayResult })
    // }
}

let getID = async (req, res) => {
    let { MaLK, ThuongHieu } = req.body;

    //check null 
    if (MaLK === '' && ThuongHieu === '')
        return res.send('chua nhap');

    // test id Hang có trùng lập với id đã nhập 
    for (let i = 1; i <= Object.keys(req.session).length; i++) {
        if (req.session[`id${i}`]?.[`MaLK`] == MaLK.trim())
            return res.send(` không nhập hàng đã nhập ${MaLK}`)
    }

    //check special characters
    let arrData = [MaLK, ThuongHieu]
    let e = CheckSpecialCharacters(arrData)
    if (e != false)
        return res.send({ error: 'chứa kí tự đặc biệt', Character: e })

    // check malk and thuonghieu
    const query = await connec.getDB().collection('Hang').find({
        MaLK
    }).toArray()

    let testHang = query[0].TinhTrangHang

    let lengthSessions = Object.keys(req.session).length;

    if (testHang.trim() == 'xuathang')
        return res.send('không thể nhập hàng đã xuất')
    console.log('check ::::::::::::', testHang)
    if (testHang) {
        req.session[`id${lengthSessions}`] = {
            MaLK, ThuongHieu
        }
        res.redirect('/exportPage')
    }
    else res.send('khong co Malk va ThuongHieu');
}
//render page export file
let getPageExportfile = async (req, res) => { // RENDER PAGE DOWLOAD BILL
    let arrayResult = [];
    let objResult = [];
    let lengthSessions = Object.keys(req.session).length // kiểm tra bao nhiêu session

    if (lengthSessions != 1) {
        for (let i = 0; i < lengthSessions; i++) {
            objResult.push(await data.result('Hang', 'renderdataExport', req.session[`id${i}`]?.['MaLK']));
            if (objResult[i][0] != undefined)
                arrayResult.push(objResult[i][0])
        }
        return res.render('convertfileExport', { layout: false, result: arrayResult })
    }
    res.send('chưa nhập hàng');

}
// nhap du lieu vao data xuat hang
let Exportfile = async (req, res) => {
    let MaLK = req.body.keyMaLK 

    MaLK?.map((key) => (
        connec.getDB().collection('Hang').updateOne(
            { MaLK: key }, { $set: { TinhTrangHang: 'xuathang' } }
        )
    ))
    return res.status(200).json({message : "export success"})
}

export default { getExportPage, getID, getPageExportfile, Exportfile, SearchStock ,SearchCustomer};      
