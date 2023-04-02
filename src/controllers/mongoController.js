import connec from '../configs/connectDBmongo.js'
import model from'../models/Hang.model'
const getALLusers = async (req,res) =>{
    try {
       let fakedata = {
        MaLK : 'lop124124124124', 
        TenLK :'cpu123',
        Donvi: '12333',
        Soluong :12,
        NgayNhap : Date.now(),
        NgayXuat : '12/1/2022' ,
        MaThuongHieu : 'razer' ,
        NCC : 'NCC1',
        Color : 'vang',
        MaKho : 'Kho111',
        GiaBanLe : '12345',
        TinhTrangHang : 'dangnhap',
       }
       const result = await model.Hangmodel(fakedata)
       console.log(result);
        // const result = await connec.getDB().collection('HoaDon').find({
        //     MaKH : "12333"
        // }).toArray()
    console.log('=============================================================');
 
        res.status(200).json(result)           
    } catch (error) {
        res.status(500).json({message :error.message})
    }
};
const createUsers =async (req,res) =>{};
const getusersInfoByID =async (req,res) =>{
    console.log(req.body.user,req.body.pass)
    res.status(200).json({message :'oke'})
};

export default {
    getALLusers , createUsers , getusersInfoByID
}