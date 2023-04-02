import jwt from 'jsonwebtoken';
import connec from '../configs/connectDBmongo.js'
import model from '../models/NhanVien.model.js'

import { _pass, test_pass } from '../services/hassPass';

let getLoginPage = (req, res) => {
  res.render('login.ejs', { layout: false });
}

let createUser = async (req, res) => {
  let { hoten, ngaysinh, sex, user_nv, pass_nv, repass_nv, phone, email, address, accessrights } = req.body;
  if(hoten.length < 5) 
    return res.send('hoten must be at least 5');
  let _Pass = _pass(pass_nv.trim(), repass_nv.trim());

  const result = await connec.getDB().collection('NhanVien').find({
    USER_NV: user_nv
  }).toArray()

  //
  if (Object.keys(result).length == 1) { // tạo 1 function riêng để check user
    return res.redirect("/");
  }
  else {
    if (pass_nv === repass_nv) {
      const dataUser = await connec.getDB().collection('NhanVien').count()

      let count = dataUser + 1;

      let data = {
        MaNV: String(count),
        TenNV: hoten,
        GioiTinh: +sex,
        DiaChi: address,
        NgaySinh: ngaysinh,
        USER_NV: user_nv,
        PASSWORD: _Pass.createpass.hash,
        SDT: phone,
        Email: email,
        NgayTao: Date.now(),
        AccessRight: accessrights,
      }
      await model.NhanVienmodel(data)
      res.cookie("user_id", count);
      return res.redirect("/registerstaff");

    }
    else console.log("test failed ");

    return res.redirect("/");
  }
}

let SignUser = async (req, res) => {

  let { user_nv, pass_nv } = req.body.formData;
  let Repassword = "", user_id = '';
  //check special characters
  let format = /[']+/;
  if (format.test(user_nv)) {
    return res.status(200).json({ message: 'chứa kí tự k hợp lệ'})
  }

  if (user_nv == '' || pass_nv == '')
    return res.status(200).json({message :"tài khoản hoặc mật khẩu để trống"})

  const result = await connec.getDB().collection('NhanVien').find({
    USER_NV: user_nv.trim()
  }).toArray()

  if ( Object.keys(result).length == 0)
    return res.status(200).json({message :'tài khoản đăng nhập không đúng '})

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
      return res.status(200).json({signin :"oke",access_token })   
    }

    else {
      return res.status(200).json({message :"wrong pass"}) 
    }

  }
}

let register = (req, res) => {
  res.render('register.ejs');
}

export default { getLoginPage, createUser, SignUser, register };  