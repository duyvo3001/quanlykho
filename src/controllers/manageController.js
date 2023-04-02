import connec from '../configs/connectDBmongo.js'
import modelHang from '../models/Hang.model'
import modelNCC from '../models/NCC.model'
import modelThuongHieu from '../models/ThuongHieu.model'
import { checkfunc } from '../services/checkData'
import data from "../services/renderdataHang";  
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
//check special characters
const CheckSpecialCharacters = (arrData) => {
  let checkArr = checkfunc(arrData)
  if (checkArr.length > 0) { return checkArr }
  else return false;
}

// -------------------------------------linh kien----------------------------------------------------
let ImportLinhkien = async (req, res) => {

  let { MaLK, TenLK, MaThuongHieu, MaNCC, Color, Donvi, Soluong, MaKho, GiaBanLe, TinhTrangHang } = req.body.formData;
  let arrData = [MaLK, TenLK, MaThuongHieu, MaNCC, Color, Donvi, Soluong, MaKho, GiaBanLe, TinhTrangHang];

  //check trống hàng 
  for (let i = 0; i < arrData.length; i++) {
    if (arrData[i] == '') return res.send('không để trống hàng');
  }

  //check special characters
  let e = CheckSpecialCharacters(arrData)
  if (e != false)
    return res.send({ error: 'chứa kí tự đặc biệt', Character: e })

  // kiểm tra trùng lập 
  let querycheck = await connec.getDB().collection('Hang').find({
    MaLK
  }).toArray()

  //check trùng mã nhập hàng 
  if (Object.keys(querycheck).length == 1)
    return res.send('trùng mã nhập hàng')

  let data = {
    MaLK,
    TenLK,
    Donvi,
    Soluong,
    NgayNhap: Date.now(),
    NgayXuat: '01/01/2001',
    MaThuongHieu,
    MaNCC,
    Color,
    MaKho,
    GiaBanLe,
    TinhTrangHang,
  }
  await modelHang.Hangmodel(data)

  res.status(200).json('message', 'oke');
}

let adjustmentPricePage = async (req, res) => {
  let { MaLK } = req.params;
  res.render('adjustmentPrice.ejs', { result: await data.result('Hang', 'render', MaLK) })
}

let adjustmentPrice = async (req, res) => {
  let { MaLK, GiaBanLe } = req.body;
  let arrData = [MaLK, GiaBanLe]

  // check null 
  for (let i = 0; i < arrData.length; i++) {
    if (arrData[i] == '') return res.send('không để trống hàng cần sửa')
  }

  //check special characters
  let e = CheckSpecialCharacters(arrData)
  if (e != false) return res.error({ error: 'chứa kí tự đặc biệt', Character: e })

  await connec.getDB().collection('Hang').updateOne(
    { MaLK },
    { $set: { GiaBanLe } }
  )

  return res.redirect('/adjustmentPricePage');
}
//render page linh kien
let getManagePage = async (req, res) => {
  res.status(200).json({ result: await data.result('Hang', 'renderData', '') }) ;
}
//post delete item linh kien  
let deleteStock = async (req, res) => {
  let MaLK = req.params.item
  await connec.getDB().collection('Hang').deleteMany({ MaLK })
  res.redirect('/ImportStock')
}
//post edit item linh kien 
let editStock = async (req, res) => {

  let { MaLK, TenLK, MaThuongHieu, MaNCC, Color, Donvi, Soluong, MaKho, GiaBanLe, TinhTrangHang } = req.body;
  let arrData = [MaLK, TenLK, MaThuongHieu, MaNCC, Color, Donvi, Soluong, MaKho, GiaBanLe, TinhTrangHang];

  //check special characters
  let e = CheckSpecialCharacters(arrData)
  if (e != false)
    return res.send({ error: 'chứa kí tự đặc biệt', Character: e })

  //kiểm tra trùng mã lập 
  let querycheck = connec.getDB().collection('Hang').find({ MaLK }).toArray()
  if (Object.keys(querycheck).length == 1)
    return res.send('trùng mã sửa hàng')

  await connec.getDB().collection('Hang').updateOne(
    { MaLK }, { $set: { TenLK, MaThuongHieu, MaNCC, Color, Donvi, Soluong, MaKho, GiaBanLe, TinhTrangHang } }
  );

  res.redirect('/ImportStock')
}
//page edit item Linh kien
let editStockPage = async (req, res) => {
  let MaLK = req.params.item
  let data = await connec.getDB().collection('Hang').find({
    MaLK
  }).toArray()
  res.render('editLinhKien.ejs', { data })
}

//----------------------------------------- Nhà cung cấp------------------------------------
const NCC = require('../models/NCC.model')
let getNCCpage = async (req, res) => {

  const test = await NCC.paginate()
  console.log(test);

  res.status(200).json({ result: await data.result('NCC', 'renderData', '') });
}
let importNCC = async (req, res) => {
  console.log(req);
  console.log("test");
  let { MaNCC, TenNCC, DiaChi, SDT , Email } = req.body.formData;

  let arrData = [MaNCC, TenNCC, DiaChi, SDT ,Email]
  console.log(arrData);
  //check special characters
  let e = CheckSpecialCharacters(arrData)
  if (e != false) return res.send({ error: 'chứa kí tự đặc biệt', Character: e })

  // check mã trùng lập 
  let querycheck = await connec.getDB().collection('NCC').find({
    MaNCC
  }).toArray()

  if (Object.keys(querycheck).length == 1)
    return res.send('trùng mã nhập hàng')

  let data = {
    MaNCC, TenNCC, DiaChi, SDT , Email
  }
  await modelNCC.NCCmodel(data)
  return res.status(200).json('message', 'oke');
}

let deleteSupplier  = async (req, res) => {
  let MaNCC = req.params.item
  await connec.getDB().collection('NCC').deleteMany({ MaNCC })
  res.redirect('/HomeSupplier ')
}
let editSupplierPage = async (req, res) => {

  let MaNCC = req.params.item
  let data = await connec.getDB().collection('NCC').find({
    MaNCC
  }).toArray()
  res.render('editNCC.ejs', { data })
}
let editSupplier = async (req, res) => {
  let { MaNCC, TenNCC, DiaChi, SDT } = req.body;
  let arrData = [MaNCC, TenNCC, DiaChi, SDT]
  //check special characters
  let e = CheckSpecialCharacters(arrData)
  if (e != false)
    return res.send({ error: 'chứa kí tự đặc biệt', Character: e })

  //kiểm tra trùng mã lập 
  let querycheck = connec.getDB().collection('NCC').find({ MaNCC }).toArray()
  if (Object.keys(querycheck).length == 1)
    return res.send('trùng mã Nhà cung cấp')
  await connec.getDB().collection('NCC').updateOne(
    { MaNCC }, { $set: { TenNCC, DiaChi, SDT } }
  );
  res.redirect('/HomeSupplier ');
}
//-----------------------------------------thương hiệu-----------------------------------------
let getThuongHieupage = async (req, res) => { // render page import 
  res.status(200).json({ result: await data.result('ThuongHieu', 'renderData', '') });
}
let editBrandPage = async (req, res) => {// render page edit
  let MaThuongHieu = req.params.item
  let data = await connec.getDB().collection('ThuongHieu').find({
    MaThuongHieu
  }).toArray()
  res.render('editThuongHieu.ejs', { data });
}
let importThuongHieu = async (req, res) => {
  console.log(req);
  let { MaThuongHieu, TenThuongHieu } = req.body.formData;
  //check special characters
  let arrData = [MaThuongHieu, TenThuongHieu]
console.log(arrData);
  let e = CheckSpecialCharacters(arrData)
  if (e != false) return res.send({ error: 'chứa kí tự đặc biệt', Character: e })

  // check mã trùng lập 
  let querycheck = await connec.getDB().collection('ThuongHieu').find({
    MaThuongHieu
  }).toArray()
  if (Object.keys(querycheck).length == 1)
    return res.send('trùng mã nhập hàng')

  let data = { MaThuongHieu, TenThuongHieu }
  await modelThuongHieu.ThuongHieumodel(data)

  res.status(200).json('message', 'oke');
}
let deleteBrand = async (req, res) => {
  let MaThuongHieu = req.params.item
  await connec.getDB().collection('ThuongHieu').deleteMany({ MaThuongHieu })
  res.redirect('/HomeBrand')
}
let editBrand = async (req, res) => {

  let { MaThuongHieu, TenThuongHieu } = req.body;
  let arrData = [MaThuongHieu, TenThuongHieu]

  //check special characters
  let e = CheckSpecialCharacters(arrData)
  if (e != false)
    return res.send({ error: 'chứa kí tự đặc biệt', Character: e })

  //kiểm tra trùng mã lập 
  let querycheck = connec.getDB().collection('ThuongHieu').find({ MaThuongHieu }).toArray()
  if (Object.keys(querycheck).length == 1)
    return res.send('trùng mã sửa hàng')

  await connec.getDB().collection('ThuongHieu').updateOne(
    { MaThuongHieu }, { $set: { TenThuongHieu } }
  );
  res.redirect('/HomeBrand');
}
//--------------------------------------------------------------------------
export default
  {
    adjustmentPrice,
    adjustmentPricePage,
    getManagePage,
    ImportLinhkien,
    editStock,
    deleteStock,
    editStockPage,
    getNCCpage,
    importNCC,
    deleteSupplier ,
    editSupplier,
    editSupplierPage,
    getThuongHieupage,
    importThuongHieu,
    deleteBrand,
    editBrandPage,
    editBrand
  };      