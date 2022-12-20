import sqlConfig from '../configs/connecDB';
import { checkfunc } from '../services/checkData'
import { result, resultThuongHieu, resultNCC } from "../services/renderdataHang";

const sql = require("mssql");
const srcfile = './src/exportfile.docx';

//check special characters
const CheckSpecialCharacters = (arrData) => {
  let checkArr = checkfunc(arrData)
  if (checkArr.length > 0) { return checkArr }
  else return false;
}

// -------------------------------------linh kien----------------------------------------------------
let importLinhKien = async (req, res) => {
  await sql.connect(sqlConfig);
  let { MaLK, TenLK, ThuongHieu, NCC, Color, Donvi, Soluong, MaKho, GiaBanLe, TinhTrangHang } = req.body;
  let arrData = [MaLK, TenLK, ThuongHieu, NCC, Color, Donvi, Soluong, MaKho, GiaBanLe, TinhTrangHang];
  //check null 
  for (let i = 0; i < checknull.length; i++) {
    if (arrData[i] == '') return res.send('không để trống hàng');
  }
  //check special characters
  let e = CheckSpecialCharacters(arrData)
  if (e != false)
    return res.send({ error: 'chứa kí tự đặc biệt', Character: e })
  // kiểm tra trùng lập 
  let querycheck = `select * from Hang where MaLK = '${MaLK.trim()}'`;
  const test = await sql.query(querycheck);
  if ((await test).rowsAffected == 1)
    return res.send('trùng mã nhập hàng')

  let query = `
  insert into Hang(MaLK,TenLK,Donvi,Soluong,NgayNhap,ThuongHieu,NCC,Color,MaKho,GiaBanLe,TinhTrangHang) 
  values(
    '${MaLK.trim()}'
    ,'${TenLK.trim()}'
    ,'${Donvi.trim()}' 
    ,${parseInt(Soluong)}
    ,convert(varchar,getdate(),20)
    ,'${ThuongHieu.trim()}'
    ,'${NCC.trim()}'
    ,'${Color.trim()}' 
    ,'${MaKho.trim()}' 
    ,${parseFloat(GiaBanLe)}
    ,'${TinhTrangHang.trim()}');
  `
  const result = await sql.query(query);
  return res.redirect('/homeLinhKien');
}

let adjustmentPricePage = async (req, res) => {
  res.render('adjustmentPrice.ejs', { result: await result('renderData', '') })
}

let adjustmentPrice = async (req, res) => {
  await sql.connect(sqlConfig);
  let { MaLK, GiaBanLe } = req.body;
  let arrData = [MaLK, GiaBanLe]
  // check null 
  for (let i = 0; i < arrData.length; i++) {
    if (arrData[i] == '') return res.send('không để trống hàng cần sửa')
  }
  //check special characters
  let e = CheckSpecialCharacters(arrData)
  if (e != false) return res.error({ error: 'chứa kí tự đặc biệt', Character: e })
  console.log('haha')
  let query = `update Hang set GiaBanLe=${parseFloat(GiaBanLe)} where MaLK='${MaLK}'`
  const result = await sql.query(query);
  return res.redirect('/adjustmentPricePage');
}
//render page linh kien
let getManagePage = async (req, res) => {
  res.render('importLinhKien.ejs', { result: await result('renderData', '') });
}
//post delete item linh kien  
let deleteItemLinhkien = async (req, res) => {
  await sql.connect(sqlConfig);
  let item = req.params.item
  let query = `delete from Hang where MaLK='${item}'`
  await sql.query(query);
  res.redirect('/homeLinhKien')
}
//post edit item linh kien 
let editItemLinhKien = async (req, res) => {
  await sql.connect(sqlConfig);
  let { MaLK, TenLK, ThuongHieu, NCC, Color, Donvi, Soluong, MaKho, GiaBanLe, TinhTrangHang } = req.body;
  let arrData = [MaLK, TenLK, ThuongHieu, NCC, Color, Donvi, Soluong, MaKho, GiaBanLe, TinhTrangHang];
  //check special characters
  let e = CheckSpecialCharacters(arrData)
  if (e != false)
    return res.send({ error: 'chứa kí tự đặc biệt', Character: e })
  //kiểm tra trùng mã lập 
  let querycheck = `select * from Hang where MaLK = '${MaLK.trim()}'`;
  const test = await sql.query(querycheck);
  if ((await test).rowsAffected == 1)
    return res.send('trùng mã sửa hàng')

  let query = `update Hang set  MaLK='${MaLK}', TenLK='${TenLK}', ThuongHieu='${ThuongHieu}', NCC='${NCC}', Color='${Color}', Donvi='${Donvi}', Soluong='${Soluong}', MaKho='${MaKho}', GiaBanLe='${GiaBanLe}', TinhTrangHang='${TinhTrangHang}' 
  where MaLK='${MaLK}'`;
  await sql.query(query);
  res.redirect('/homeLinhKien')
}
//page edit item Linh kien
let editItemLinhKienPage = async (req, res) => {
  await sql.connect(sqlConfig);
  let item = req.params.item
  let data = [];
  let query = `select * from Hang where MaLK = '${item}'`
  let result = await sql.query(query);
  data = result.recordset
  res.render('editLinhKien.ejs', { data })
}
//----------------------------------------- Nhà cung cấp------------------------------------
let getNCCpage = async (req, res) => {
  res.render('importNCC.ejs', { result: await resultNCC('renderData', '') });
}
let importNCC = async (req, res) => {
  await sql.connect(sqlConfig);
  let { MaNCC, TenNCC, DiaChi, SDT } = req.body;
  let arrData = [MaNCC, TenNCC, DiaChi, SDT]
  //check special characters
  let e = CheckSpecialCharacters(arrData)
  if (e != false) return res.send({ error: 'chứa kí tự đặc biệt', Character: e })
  // check mã trùng lập 
  let querycheck = `select * from NCC where MaNCC = ${MaNCC.trim()}`;
  const test = await sql.query(querycheck);
  if ((await test).rowsAffected == 1)
    return res.send('trùng mã nhập hàng')

  let query = `insert into NCC values('${MaNCC.trim()}','${TenNCC.trim()}','${DiaChi.trim()}','${SDT.trim()}')`;
  const result = await sql.query(query);
  return res.redirect('/homeNCC');
}

let deleteItemNCC = async (req, res) => {
  await sql.connect(sqlConfig);
  let item = req.params.item
  let query = `delete from NCC where MaNCC='${item}'`
  await sql.query(query);
  res.redirect('/homeNCC')
}
let editItemNCCPage = async (req, res) => {
  await sql.connect(sqlConfig);
  let item = req.params.item
  let data = [];
  let query = `select * from NCC where MaNCC = '${item}'`
  let result = await sql.query(query);
  data = result.recordset
  res.render('editNCC.ejs', { data })
}
let editItemNCC = async (req, res) => {
  await sql.connect(sqlConfig);
  let { MaNCC, TenNCC, DiaChi, SDT } = req.body;
  let arrData = [ MaNCC, TenNCC, DiaChi, SDT]
  //check special characters
  let e = CheckSpecialCharacters(arrData)
  if (e != false)
    return res.send({ error: 'chứa kí tự đặc biệt', Character: e })
    
  //kiểm tra trùng mã lập 
  let querycheck = `select * from NCC where MaNCC = '${MaNCC.trim()}'`;
  const test = await sql.query(querycheck);
  if ((await test).rowsAffected == 1)
    return res.send('trùng mã Nhà cung cấp')
  let query = `update NCC set MaNCC = '${MaNCC.trim()}' , TenNCC='${TenNCC.trim()}' , DiaChi ='${DiaChi.trim()}' , SDT = '${SDT.trim()}' where MaNCC = '${MaNCC}'`
  await sql.query(query);
  res.redirect('/homeNCC');
}
//-----------------------------------------thương hiệu-----------------------------------------
let getThuongHieupage = async (req, res) => { // render page import 
  res.render('importThuongHieu.ejs', { result: await resultThuongHieu('renderData', '') });
}
let editItemThuongHieuPage = async (req, res) => {// render page edit
  await sql.connect(sqlConfig);
  let item = req.params.item
  let data = [];
  let query = `select * from ThuongHieu where MaThuongHieu = '${item}'`
  let result = await sql.query(query);
  data = result.recordset
  res.render('editThuongHieu.ejs', { data });
}
let importThuongHieu = async (req, res) => {
  await sql.connect(sqlConfig);
  let { MaThuongHieu, TenThuongHieu } = req.body;
  //check special characters
  let arrData = [MaThuongHieu, TenThuongHieu]
  let e = CheckSpecialCharacters(arrData)
  if (e != false) return res.send({ error: 'chứa kí tự đặc biệt', Character: e })
  // check mã trùng lập 
  let querycheck = `select * from ThuongHieu where MaThuongHieu = '${MaThuongHieu.trim()}'`;
  const test = await sql.query(querycheck);
  if ((await test).rowsAffected == 1)
    return res.send('trùng mã nhập hàng')

  let query = `insert into ThuongHieu values('${MaThuongHieu.trim()}','${TenThuongHieu.trim()}')`;
  const result = await sql.query(query);
  console.log(result);
  return res.redirect('/homeThuongHieu');
}
let deleteItemThuongHieu = async (req, res) => {

  await sql.connect(sqlConfig);
  let item = req.params.item
  if(!item){
    return res.send('không để trống mã ')
  }
  let query = `delete from ThuongHieu where MaThuongHieu='${item}'`
  await sql.query(query);
  res.redirect('/homeThuongHieu')
}
let editItemThuongHieu = async (req, res) => {
  await sql.connect(sqlConfig);
  let { MaThuongHieu, TenThuongHieu } = req.body;
  let arrData = [MaThuongHieu, TenThuongHieu]

  //check special characters
  let e = CheckSpecialCharacters(arrData)
  if (e != false)
    return res.send({ error: 'chứa kí tự đặc biệt', Character: e })

  //kiểm tra trùng mã lập 
  let querycheck = `select * from ThuongHieu where MaThuongHieu = '${MaThuongHieu.trim()}'`;
  const test = await sql.query(querycheck);
  if ((await test).rowsAffected == 1)
    return res.send('trùng mã sửa hàng')

  let query = `update ThuongHieu set MaThuongHieu = '${MaThuongHieu.trim()}' , TenThuongHieu='${TenThuongHieu.trim()}'  where MaThuongHieu = '${MaThuongHieu}'`
  await sql.query(query);
  res.redirect('/homeThuongHieu');
}
//--------------------------------------------------------------------------
export default
  {
    adjustmentPrice,
    adjustmentPricePage,
    getManagePage,
    importLinhKien,
    editItemLinhKien,
    deleteItemLinhkien,
    editItemLinhKienPage,
    getNCCpage,
    importNCC,
    deleteItemNCC,
    editItemNCC,
    editItemNCCPage,
    getThuongHieupage,
    importThuongHieu,
    deleteItemThuongHieu,
    editItemThuongHieuPage,
    editItemThuongHieu
  };      