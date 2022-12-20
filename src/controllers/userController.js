import jwt from 'jsonwebtoken';
import sqlConfig from '../configs/connecDB';
const sql = require("mssql");
import { _pass, test_pass } from '../services/hassPass';

let getLoginPage = (req, res) => {
  res.render('login.ejs', { layout: false });
}

let createUser = async (req, res) => {
  let { hoten, ngaysinh, sex, user_nv, pass_nv, repass_nv, phone, address, accessrights } = req.body;
  console.log(hoten, ngaysinh, sex, user_nv, pass_nv, repass_nv, phone, address, accessrights);
  let _Pass = _pass(pass_nv.trim(), repass_nv.trim());

  await sql.connect(sqlConfig);
  const result = await sql.query(
    `SELECT USER_NV FROM NhanVien where USER_NV='${user_nv.trim()}'`
  );
  //
  if ((await result).rowsAffected == 1) { // tạo 1 function riêng để check user
    console.log("registered");
    return res.redirect("/");
  } else {
    if (pass_nv === repass_nv) {
      let countUsers = await sql.query(
        `select Max(CONVERT(int, MaNV)) as tinh from NhanVien`
      );
      let count = +countUsers.recordsets[0][0].tinh + 1;
      console.log(count)
      const CreateUser = sql.query(`
                insert into NhanVien (MaNV,TenNV,GioiTinh,NgaySinh,DiaChi,User_NV,Password_NV,SDT,accessrights)
                values(
                  '${count}',
                  '${hoten.trim()}',
                   ${parseInt(sex)},
                   ${ngaysinh},
                  '${address.trim()}',
                  '${user_nv}',
                  '${_Pass.createpass.hash}',
                  '${phone.trim()}',
                  '${accessrights}')`
      );
      res.cookie("user_id", count);
      return res.redirect("/registerstaff");

    }
    else console.log("test failed ");

    return res.redirect("/");
  }
}

let SignUser = async (req, res) => {

  await sql.connect(sqlConfig);
  let { user_nv, pass_nv } = req.body;
  let Repassword = "",user_id ='';
  
  //check special characters
  let format = /[']+/;
  if (format.test(user_nv)) {
      return res.send({ error: 'chứa kí tự đặc biệt'})
  } 

  if (user_nv == '' || pass_nv == '')
    return res.send("tài khoản hoặc mật khẩu để trống")

  const result = await sql.query(
    `SELECT MaNV, USER_NV, PASSWORD_NV FROM NhanVien where USER_NV='${user_nv.trim()}'`
  );
  if ((await result).rowsAffected == 0)
    return res.send('tài khoản đăng nhập không đúng ')

  for (let i = 0; i < result.rowsAffected; i++) {
    Repassword = result.recordset[i].PASSWORD_NV;
    user_id = result.recordset[i].MaNV;
  }

  if ((await result).rowsAffected == 1) {
    let _RePassTest = test_pass(pass_nv.trim(), Repassword.trim());

    if (_RePassTest.test_Hash == true) {
      const data = req.body;
      const access_token = jwt.sign(data, process.env.ACCESS_TOKEN, { expiresIn: '3400s' })
      req.session.authenticated = true;
      res.cookie("access_token", access_token, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      });
      return res.redirect("/homeLinhKien");
    }

    else {
      return res.send("sai mat khau");
    }

  }
}

let register = (req, res) => {
  res.render('register.ejs');
}

export default { getLoginPage, createUser, SignUser, register };  