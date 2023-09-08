import jwt from 'jsonwebtoken';
import connec from '../configs/connectDBmongo.js'
import model from '../models/NhanVien.model.js'
import data from "../services/renderdataHang";
import { UpdateUserServices } from "../services/UpdateItem"
import { _pass, test_pass } from '../services/hassPass';
import { checkfunc } from '../services/checkData'

import mongoose from "mongoose"

const CheckSpecialCharacters = (arrData) => {
  let checkArr = checkfunc(arrData)
  if (checkArr.length > 0) { return checkArr }
  else return false;
}

let getInfoUser = async (req, res) => {
  const _id = req.params.id
  res.status(200).json({ result: await data.result('NhanVien', '', _id, "", "") });
}

let getStaffPage = async (req, res) => {
  const pageIndex = req.params.pageIndex || 1;
  const limit = 16;
  const skip = (pageIndex - 1) * limit;
  res.status(200).json({ result: await data.result('NhanVien', 'renderData', '', limit, skip) });
}

let createUser = async (req, res) => {
  let { MaNV, TenNV, NgaySinh, USER_NV, pass_nv, repass_nv, SDT, Email, DiaChi } = req.body.formData;
  let { Accessright, Sex } = req.body;

  if (TenNV?.length < 5)
    return res.status(404).json({ message: 'hoten must be at least 5' });
  let _Pass = _pass(pass_nv, repass_nv);

  const result = await connec.getDB().collection('NhanVien').find({ USER_NV }).toArray()

  //
  if (Object.keys(result).length == 1) { // tạo 1 function riêng để check user
    return res.status(404).json({ message: "da co user" })
  }
  else {
    if (pass_nv === repass_nv) {
      let data = {
        MaNV: MaNV,
        TenNV: TenNV,
        GioiTinh: Sex,
        DiaChi: DiaChi,
        NgaySinh: NgaySinh,
        USER_NV: USER_NV,
        PASSWORD: _Pass.createpass.hash,
        SDT: SDT,
        Email: Email,
        NgayTao: Date.now(),
        Accessright,
      }
      await connec.getDB().collection("NhanVien").insertOne(data)

      return res.status(201).json({ message: 'created successfully' });
    }
    else
      return res.status(400).json({ message: 'failed' });
  }
}

let SignUser = async (req, res) => {

  let { user_nv, pass_nv } = req.body.formData;
  console.log(user_nv, pass_nv)
  let Repassword = "", user_id = '', accessrights = {};

  //check special characters
  let format = /[']+/;
  if (format.test(user_nv)) {
    return res.status(202).json({ eror: "wrong", message: 'Contains invalid characters' })
  }

  if (user_nv == '' || pass_nv == '' || user_nv == undefined || pass_nv == undefined)
    return res.status(202).json({ message: "user or password is void" })

  const result = await connec.getDB().collection('NhanVien').find({
    USER_NV: user_nv?.trim()
  }).toArray()

  if (Object.keys(result).length == 0)
    return res.status(202).json({ message: 'user is blank' })

  for (let i = 0; i < Object.keys(result).length; i++) {
    Repassword = result[i].PASSWORD;
    user_id = result[i].MaNV;
    accessrights = result[i]?.Accessright
  }

  if (Object.keys(result).length == 1) {
    let _RePassTest = test_pass(pass_nv.trim(), Repassword.trim());

    if (_RePassTest.test_Hash == true) {
      try {
        const data = { accessrights, user_id };
        const access_token = jwt.sign(data, process.env.ACCESS_TOKEN, { expiresIn: '10h' })
        return res.status(200).json({ signin: "oke", access_token, _id: result[0]._id })
      } catch (error) {
        return res.status(500)
      }
    }
    else {
      return res.status(202).json({ message: "wrong pass" })
    }
  }
}

let updateUser = async (req, res) => {
  let {
    MaNV, TenNV, NgaySinh, USER_NV, pass_nv, repass_nv, SDT, Email, DiaChi, _id
  } = req.body.formData;
  let Accessright = req.body?.Accessright

  let GioiTinh = req.body.Sex
  let arrData = [MaNV, TenNV, NgaySinh, USER_NV, pass_nv, repass_nv, SDT, Email, DiaChi];
  // check special characters
  let e = CheckSpecialCharacters(arrData)
  if (e != false)
    return res.status(404).json({ error: 'chứa kí tự đặc biệt', Character: e })

  //kiểm tra trùng mã lập 
  let querycheck = connec.getDB().collection('Hang').find({ MaNV }).toArray()
  if (Object.keys(querycheck).length == 1)
    return res.status(404).json({ message: 'trùng mã nhân viên' })

  let Password
  if (pass_nv) {
    let _Pass = _pass(pass_nv);
    Password = _Pass.createpass.hash
  }

  let UpdateuserServices = new UpdateUserServices()
  let updateItem = undefindAccess(UpdateuserServices, Accessright, Password, GioiTinh, MaNV, TenNV, NgaySinh, USER_NV, SDT, Email, DiaChi)

  let fileId = new mongoose.Types.ObjectId(_id);

  const updateUser = await connec.getDB().collection('NhanVien').updateOne(
    { _id: fileId }, {
    $set: updateItem
  }
  )
  console.log(updateUser)

  if (updateUser.acknowledged == true)
    return res.status(200).json({ message: "oke" })
  else
    return res.status(500).json({ message: "eror undefind" })
}

function undefindAccess(UpdateuserServices, Accessright, Password, GioiTinh, MaNV, TenNV, NgaySinh, USER_NV, SDT, Email, DiaChi) {
  let updateItem = null

  if (Accessright == undefined) {
    updateItem = UpdateuserServices.getTransport(
      {
        MaNV, TenNV, NgaySinh, GioiTinh, USER_NV,
        PASSWORD: Password, SDT, Email, DiaChi
      }
    )
  }
  else {
    updateItem = UpdateuserServices.getTransport(
      {
        MaNV, TenNV, NgaySinh, GioiTinh, USER_NV,
        PASSWORD: Password, SDT, Email, DiaChi,
        Accessright
      }
    )
  }
  return updateItem
}
let deleteUser = async (req, res) => {
  let MaNV = req.params.item
  await connec.getDB().collection('NhanVien').deleteMany({ MaNV: MaNV.trim() })
  res.status(200).json({ message: 'delete sucsess' })
}
export default { getStaffPage, createUser, SignUser, deleteUser, updateUser, getInfoUser };  