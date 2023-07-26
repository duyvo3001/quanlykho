import connec from '../configs/connectDBmongo.js'
import modelHang from '../models/Hang.model'
import modelNCC from '../models/NCC.model'
import modelThuongHieu from '../models/ThuongHieu.model'
import { checkfunc } from '../services/checkData'
import mongoose from "mongoose"
import data from "../services/renderdataHang";
import { UpdateItemBrandServices, UpdateItemStockServices, UpdateItemSupplierServices } from '../services/UpdateItem.js'
//check special characters
const CheckSpecialCharacters = (arrData) => {
  let checkArr = checkfunc(arrData)
  if (checkArr.length > 0) { return checkArr }
  else return false;
}

// -------------------------------------linh kien----------------------------------------------------
let createIdProduct = async (Category, MaThuongHieu) => {
  return Category + MaThuongHieu + Math.floor(Math.random() * Math.floor(Math.random() * Date.now())).toString(16)
}
let ImportLinhkien = async (req, res) => {

  let { Category, TenLK, MaThuongHieu, MaNCC, Color, Donvi, Soluong, MaKho, GiaBanLe, TinhTrangHang } = req.body.formData;
  let arrData = [Category, MaThuongHieu, MaNCC, Color, Donvi, Soluong, MaKho, GiaBanLe, TinhTrangHang];

  //check trống hàng 
  for (let i = 0; i < arrData.length; i++) {
    if (arrData[i] == '') return res.status(500).json({ message: 'không để trống hàng', Character: e })
  }

  //check special characters
  let e = CheckSpecialCharacters(arrData)
  if (e != false)
    return res.status(500).json({ message: 'chứa kí tự đặc biệt', Character: e })

  let MaLK = await createIdProduct(Category, MaThuongHieu) // create IdProduct
  console.log(MaLK)
  let data = {
    MaLK,
    Category,
    TenLK,
    Donvi,
    Soluong,
    NgayNhap: Date.now(),
    MaThuongHieu,
    MaNCC,
    Color,
    MaKho,
    GiaBanLe,
    TinhTrangHang: TinhTrangHang || "GOOD",
  }
  try {
    let result = await modelHang.Hangmodel(data)
    console.log(result);
    if (result.acknowledged === true) {
      return res.status(200).json({ message: 'Create product success' });
    }
    else {
      return res.status(500).json({ message: `Can not create product` })
    }
  } catch (error) {
    return res.status(500).json({ message: `Can not create product` })
  }
}
//render page linh kien
let getManagePage = async (req, res) => {
  const pageIndex = req.params.pageIndex || 1;
  const limit = 16;
  const skip = (pageIndex - 1) * limit;
  return res.status(200).json({ result: await data.result('Hang', 'renderData', '', limit, skip) });
}
//post delete item linh kien  
let deleteStock = async (req, res) => {
  let MaLK = req.params.item
  console.log(MaLK)
  let Resultdata = await connec.getDB().collection('Hang').deleteMany({ MaLK })

  if (Resultdata.acknowledged == true && Resultdata.deletedCount == 1) {
    return res.status(200).json({ message: 'oke' });
  }
  else {
    return res.status(500).json({ error: 'erorr' });
  }
}
//post edit item linh kien 
let editStock = async (req, res) => {

  let { MaLK, Category, TenLK, MaThuongHieu, MaNCC, Color, Donvi, Soluong, MaKho, GiaBanLe, TinhTrangHang, _id } = req.body.formData;
  let arrData = [MaLK, Category, TenLK, MaThuongHieu, MaNCC, Color, Donvi, Soluong, MaKho, GiaBanLe, TinhTrangHang];

  let updateItemStockServices = new UpdateItemStockServices()
  let updateItem = updateItemStockServices.getTransport({ MaLK, Category, TenLK, MaThuongHieu, MaNCC, Color, Donvi, Soluong, MaKho, GiaBanLe, TinhTrangHang })
  let fileId = new mongoose.Types.ObjectId(_id);
  //check special characters
  let e = CheckSpecialCharacters(arrData)
  if (e != false)
    return res.status(404).json({ error: 'chứa kí tự đặc biệt', Character: e })

  //kiểm tra trùng mã lập 
  let querycheck = connec.getDB().collection('Hang').find({ MaLK }).toArray()
  if (Object.keys(querycheck).length == 1)
    return res.status(404).json({ message: 'trùng mã sửa hàng' })

  await connec.getDB().collection('Hang').updateOne(
    { _id: fileId }, {
    $set: updateItem
  }
  );
  return res.status(200).json({ message: "oke" })
}
let AddProduct = async (req, res) => {
  let { MaLK, Soluong } = req.body.formData;
  let _QTYproduct = await data.result('Hang', '', MaLK, "", "")

  let _TotalQtyProuct = Number(_QTYproduct[0].Soluong) + Number(Soluong)

  const reslut = await connec.getDB().collection('Hang').updateOne(
    { MaLK }, {
    $set: { Soluong: _TotalQtyProuct }
  }
  );
  return reslut.acknowledged === true ? res.status(200).json({ message: "update successfully" }) : res.status(500).json({ message: "update error" });
}
let getProduct = async (req, res) => {
  const product = req.params.item
  return res.status(200).json({ result: await data.result('Hang', '', product, "", "") });
}
//----------------------------------------- Nhà cung cấp------------------------------------
let getNCCpage = async (req, res) => {
  const pageIndex = req.params.pageIndex || 1;
  const limit = 20;
  const skip = (pageIndex - 1) * limit;

  res.status(200).json({ result: await data.result('NCC', 'renderData', '', limit, skip) });
}
let importNCC = async (req, res) => {
  let { MaNCC, TenNCC, DiaChi, SDT, Email } = req.body.formData;

  let arrData = [MaNCC, TenNCC, DiaChi, SDT, Email]
  //check special characters
  let e = CheckSpecialCharacters(arrData)
  if (e != false) return res.status(404).json({ error: 'chứa kí tự đặc biệt', Character: e })

  // check mã trùng lập 
  let querycheck = await connec.getDB().collection('NCC').find({
    MaNCC
  }).toArray()

  if (Object.keys(querycheck).length == 1)
    return res.status(500).json({ message: 'trùng mã nhập hàng' })

  try {
    let data = {
      MaNCC, TenNCC, DiaChi, SDT, Email, NgayNhap: Date.now(),
    }
    const result = await modelNCC.NCCmodel(data)
    if (result.acknowledged === true) {
      return res.status(200).json({ message: 'Create product success' });
    }
    else {
      return res.status(500).json({ message: `Can not create product` })
    }
  } catch (error) {
    return res.status(500).json({ message: `Can not create product` })
  }
}

let deleteSupplier = async (req, res) => {
  let MaNCC = req.params.item
  let Resultdata = await connec.getDB().collection('NCC').deleteMany({ MaNCC })
  if (Resultdata.acknowledged == true && Resultdata.deletedCount == 1) {
    return res.status(200).json({ message: 'oke' });
  }
  else {
    return res.status(500).json({ error: 'erorr' });
  }
}
let editSupplier = async (req, res) => {
  let { MaNCC, TenNCC, DiaChi, SDT, _id } = req.body.formData;
  let arrData = [MaNCC, TenNCC, DiaChi, SDT]

  let updateItemSupplierService = new UpdateItemSupplierServices()
  let updateItem = updateItemSupplierService.getTransport({ MaNCC, TenNCC, DiaChi, SDT })
  let fileId = new mongoose.Types.ObjectId(_id);

  //check special characters
  let e = CheckSpecialCharacters(arrData)
  if (e != false)
    return res.status(404).json({ error: 'chứa kí tự đặc biệt', Character: e })

  //kiểm tra trùng mã lập 
  let querycheck = connec.getDB().collection('NCC').find({ MaNCC }).toArray()
  if (Object.keys(querycheck).length == 1)
    return res.status(404).json({ message: 'trùng mã sửa hàng' })
  await connec.getDB().collection('NCC').updateOne(
    { _id: fileId }, {
    $set: updateItem
  }
  );
  res.status(200).json({ message: "oke" })

}
//-----------------------------------------thương hiệu-----------------------------------------
let getThuongHieupage = async (req, res) => { // render page import 
  const pageIndex = req.params.pageIndex || 1;
  const limit = 25;
  const skip = (pageIndex - 1) * limit;
  res.status(200).json({ result: await data.result('ThuongHieu', 'renderData', '', limit, skip) });
}
let importThuongHieu = async (req, res) => {
  let { MaThuongHieu, TenThuongHieu } = req.body.formData;
  //check special characters
  let arrData = [MaThuongHieu, TenThuongHieu]

  let e = CheckSpecialCharacters(arrData)
  if (e != false) return res.status(200).json({ error: 'chứa kí tự đặc biệt', Character: e })

  // check mã trùng lập 
  let querycheck = await connec.getDB().collection('ThuongHieu').find({
    MaThuongHieu
  }).toArray()

  if (Object.keys(querycheck).length == 1)
    return res.status(500).json({ message: 'trùng mã nhập hàng' })

  try {
    let data = { MaThuongHieu: MaThuongHieu.trim(), TenThuongHieu, NgayNhap: Date.now() }
    let result = await modelThuongHieu.ThuongHieumodel(data)

    if (result.acknowledged === true) {
      return res.status(200).json({ message: 'Create product success' });
    }
    else {
      return res.status(500).json({ message: `Can not create product` })
    }
  } catch (error) {
    return res.status(500).json({ message: `Can not create product` })
  }
}
let deleteBrand = async (req, res) => {
  let MaThuongHieu = req.params.item
  let Resultdata = await connec.getDB().collection('ThuongHieu').deleteMany({ MaThuongHieu })

  if (Resultdata.acknowledged == true && Resultdata.deletedCount == 1) {
    return res.status(200).json({ message: 'oke' });
  }
  else {
    return res.status(500).json({ error: 'erorr' });
  }
}
let editBrand = async (req, res) => {
  let { MaThuongHieu, TenThuongHieu, _id } = req.body.formData;

  let updateItemBrandServices = new UpdateItemBrandServices()
  let updateItem = updateItemBrandServices.getTransport({ MaThuongHieu, TenThuongHieu })
  console.log(updateItem)
  let fileId = new mongoose.Types.ObjectId(_id);

  let arrData = [MaThuongHieu, TenThuongHieu]

  //check special characters
  let e = CheckSpecialCharacters(arrData)
  if (e != false)
    return res.status(404).json({ error: 'chứa kí tự đặc biệt', Character: e })

  //kiểm tra trùng mã lập 
  let querycheck = connec.getDB().collection('ThuongHieu').find({ MaThuongHieu }).toArray()
  if (Object.keys(querycheck).length == 1)
    return res.status(404).json({ message: 'trùng mã sửa hàng' })

  // query update
  await connec.getDB().collection('ThuongHieu').updateOne(
    { _id: fileId }, {
    $set: updateItem
  }
  )

  res.status(200).json({ message: "oke" })
}
//--------------------------------------------------------------------------
export default
  {
    AddProduct,
    getManagePage,
    ImportLinhkien,
    editStock,
    deleteStock,
    getNCCpage,
    importNCC,
    deleteSupplier,
    editSupplier,
    getThuongHieupage,
    importThuongHieu,
    deleteBrand,
    editBrand,
    getProduct
  };      