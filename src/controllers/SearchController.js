import { request } from "express";
import  { result, resultThuongHieu, resultNCC } from "../services/renderdataHang";
const sql = require("mssql");
const searchfunc = (search)=>{
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if(format.test(search)){
      return true;
    } else {
      return false;
    }
}
const SearchLinhKien = async (req, res) => {
    let { search } = req.body;
    searchfunc(search) ? res.send('chứa kí tự đặt biệt') : 
    res.render('importLinhKien.ejs', { result: await result('',search) })
}

const SearchNCC = async (req, res) => {
    let { search } = req.body;
    searchfunc(search) ? res.send('chứa kí tự đặt biệt') : 
    res.render('importNCC.ejs', { result: await resultNCC('',search) })
}

const SearchThuongHieu = async (req, res) => {
    let { search } = req.body;
    searchfunc(search) ? res.send('chứa kí tự đặt biệt') : 
    res.render('importThuongHieu.ejs', { result: await resultThuongHieu('',search) })
}
export default { SearchLinhKien, SearchNCC, SearchThuongHieu }