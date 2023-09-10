import connec from '../configs/connectDBmongo.js'
import data from "../services/renderdataHang";
import model from "../models/KhoHang.model"
import { checkfunc } from '../services/checkData'
import { UpdateWarehouseServices } from "../services/UpdateItem";
import mongoose from "mongoose"
const CheckSpecialCharacters = (arrData) => {
    let checkArr = checkfunc(arrData)
    if (checkArr.length > 0) { return checkArr }
    else return false;
}
let getWarehousePage = async (req, res) => { // render page import 
    const pageIndex = req.params.pageIndex || 1;
    const limit = 25;
    const skip = (pageIndex - 1) * limit;
    res.status(200).json({ result: await data.result('KhoHang', 'renderData', '', limit, skip) });
}
let importWarehouse = async (req, res) => { // render page import
    let { MaKho, TenKho, DiaChi, SDT } = req.body.formData;

    //check special characters
    let arrData = [MaKho, TenKho, DiaChi, SDT]
    let e = CheckSpecialCharacters(arrData)
    if (e != false) return res.status(500).json({ message: 'chứa kí tự đặc biệt', Character: e })

    // check mã trùng lập 
    let querycheck = await connec.getDB().collection('KhoHang').find({
        MaKho
    }).toArray()
    if (Object.keys(querycheck).length == 1)
        return res.status(500).json('trùng mã nhập Kho')

    try {
        let data = { MaKho, TenKho, DiaChi, SDT, NgayTao: Date.now() }
        const result = await model.KhoHangmodel(data)
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
let deleteWarehouse = async (req, res) => {
    let MaKho = req.params.item
    await connec.getDB().collection('KhoHang').deleteMany({ MaKho })
    res.status(200).json({ message: 'delete sucsess' })
}
let editWarehouse = async (req, res) => {
    let { MaKho, TenKho, DiaChi, SDT, _id } = req.body.formData;

    let updateItemWarehouseServices = new UpdateWarehouseServices()
    let updateItem = updateItemWarehouseServices.getTransport({ MaKho, TenKho, DiaChi, SDT })
    let fileId = new mongoose.Types.ObjectId(_id);

    let arrData = [MaKho, TenKho, DiaChi, SDT,]

    //check special characters
    let e = CheckSpecialCharacters(arrData)
    if (e != false)
        return res.status(500).json({ error: 'chứa kí tự đặc biệt', Character: e })

    //kiểm tra trùng mã lập 
    let querycheck = connec.getDB().collection('KhoHang').find({ MaKho }).toArray()
    if (Object.keys(querycheck).length == 1)
        return res.status(500).json({ message: 'trùng mã sửa hàng' })

    // query update
    await connec.getDB().collection('KhoHang').updateOne(
        { _id: fileId }, {
        $set: updateItem
    }
    )

    res.status(200).json({ message: "oke" })
}
export default
    {
        getWarehousePage, importWarehouse, deleteWarehouse, editWarehouse
    }