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
let getStaffPage = async (req, res) => {
  const pageIndex = req.params.pageIndex || 1;
  const limit = 16;
  const skip = (pageIndex - 1) * limit;
  res.status(200).json({ result: await data.result('NhanVien', 'renderData', '', limit, skip) });
}

let createUser = async (req, res) => {
  let { MaNV, TenNV, NgaySinh, USER_NV, pass_nv, repass_nv, SDT, Email, DiaChi } = req.body.formData;
  let { update, read, valuedelete, create } = req.body.AccessRight;
  let Sex = req.body.Sex;
  console.log(DiaChi)
  const AccessRight = {
    update: update, read: read, valuedelete: valuedelete, create: create
  }

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
        AccessRight: AccessRight,
      }
      await model.NhanVienmodel(data)

      return res.status(201).json({ message: 'created successfully' });

    }
    else console.log("test failed ");

    return res.status(400).json({ message: 'failed' });
  }
}

let SignUser = async (req, res) => {

  let { user_nv, pass_nv } = req.body.formData;
  let Repassword = "", user_id = '';
  //check special characters
  let format = /[']+/;
  if (format.test(user_nv)) {
    return res.status(404).json({ eror: "ron", message: 'chứa kí tự k hợp lệ' })
  }

  if (user_nv == '' || pass_nv == '')
    return res.status(404).json({ message: "tài khoản hoặc mật khẩu để trống" })

  const result = await connec.getDB().collection('NhanVien').find({
    USER_NV: user_nv?.trim()
  }).toArray()

  if (Object.keys(result).length == 0)
    return res.status(404).json({ message: 'tài khoản đăng nhập không đúng ' })

  for (let i = 0; i < Object.keys(result).length; i++) {
    Repassword = result[i].PASSWORD;
    user_id = result[i].MaNV;
  }

  if (Object.keys(result).length == 1) {
    let _RePassTest = test_pass(pass_nv.trim(), Repassword.trim());

    if (_RePassTest.test_Hash == true) {
      const data = req.body;
      const access_token = jwt.sign(data, process.env.ACCESS_TOKEN, { expiresIn: '3400s' })
      console.log(access_token);
      return res.status(200).json({ signin: "oke", access_token })
    }

    else {
      return res.status(404).json({ message: "wrong pass" })
    }

  }
}

let updateUser = async (req, res) => {

  let {
    MaNV, TenNV, NgaySinh, GioiTinh, USER_NV, pass_nv, repass_nv, SDT, Email, DiaChi, _id
  } = req.body.formData;
  let arrData = [MaNV, TenNV, NgaySinh, GioiTinh, USER_NV, pass_nv, repass_nv, SDT, Email, DiaChi];

  //check special characters
  let e = CheckSpecialCharacters(arrData)
  if (e != false)
    return res.status(404).json({ error: 'chứa kí tự đặc biệt', Character: e })

  //kiểm tra trùng mã lập 
  let querycheck = connec.getDB().collection('Hang').find({ MaNV }).toArray()
  if (Object.keys(querycheck).length == 1)
    return res.status(404).json({ message: 'trùng mã nhân viên' })

  let _Pass = _pass(pass_nv, repass_nv);

  let UpdateuserServices = new UpdateUserServices()

  let updateItem = UpdateuserServices.getTransport(
    {
      MaNV, TenNV, NgaySinh, GioiTinh, USER_NV,
      pass_nv: _Pass.createpass.hash, SDT, Email, DiaChi,
      accessrights: req.body.AccessRight
    }
  )
  let fileId = new mongoose.Types.ObjectId(_id);

  await connec.getDB().collection('NhanVien').updateOne(
    { _id: fileId }, {
    $set: updateItem
  }
  );

  return res.status(200).json({ message: "oke" })
}

let deleteUser = async (req, res) => {
  let MaNV = req.params.item
  await connec.getDB().collection('NhanVien').deleteMany({ MaNV: MaNV.trim() })
  res.status(200).json({ message: 'delete sucsess' })
}
export default { getStaffPage, createUser, SignUser, deleteUser, updateUser };  