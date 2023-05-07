import modelCustomer from "../models/Customer.model";
import { checkfunc } from '../services/checkData'
import mongoose from "mongoose"
import connec from '../configs/connectDBmongo.js'
import data from "../services/renderdataHang";
import { UpdateCustomerServices } from "../services/UpdateItem"
const CheckSpecialCharacters = (arrData) => {
    let checkArr = checkfunc(arrData)
    if (checkArr.length > 0) { return checkArr }
    else return false;
}

let CustomerPage = async (req, res) => {

    const pageIndex = req.params.pageIndex || 1;
    const limit = 16;
    const skip = (pageIndex - 1) * limit;
    return res.status(200).json({ result: await data.result('Customer', 'renderData', '', limit, skip) });

}

let importCustomer = async (req, res) => {

    let { IDCustomer, NameCustomer, Phone, Email } = req.body.formData

    let arrData = [IDCustomer, NameCustomer, Phone, Email]

    for (let i = 0; i < arrData.length; i++) {
        if (arrData[i] == '') return res.status(200).json('message', 'NAME CANT BE NULL');
    }

    //check special characters

    let e = CheckSpecialCharacters(arrData)
    if (e != false) return res.send({ error: 'chứa kí tự đặc biệt', Character: e })
    // kiểm tra trùng lập 

    let querycheck = await connec.getDB().collection('Hang').find({ IDCustomer }).toArray()

    //check trùng mã nhập hàng 
    if (Object.keys(querycheck).length == 1)
        return res.status(200).json('message', 'oke');

    let data = {
        IDCustomer, NameCustomer, Phone, Email, NgayTao: Date.now(),
    }
    await modelCustomer.Customermodel(data)

    return res.status(200).json('message', 'oke');

}

let UpdateCustomer = async (req, res) => {

    let { _id ,IDCustomer, NameCustomer, Phone, Email } = req.body.formData
    
    let arrData = [IDCustomer, NameCustomer, Phone, Email]
    console.log(arrData);
    let updateCustomerServices = new UpdateCustomerServices()
    let updateCus = updateCustomerServices.getTransport({ IDCustomer, NameCustomer, Phone, Email })
    console.log(updateCus)
    let fileId = new mongoose.Types.ObjectId(_id);

    //check special characters
    let e = CheckSpecialCharacters(arrData)
    if (e != false) return res.send({ error: 'chứa kí tự đặc biệt', Character: e })

    //kiểm tra trùng mã lập 
    let querycheck = connec.getDB().collection('Customer').find({ IDCustomer }).toArray()
    if (Object.keys(querycheck).length == 1)
        return res.status(404).json({ message: 'trùng ID' })

    await connec.getDB().collection('Customer').updateOne(
        { _id: fileId }, {
        $set: updateCus
    })

    return res.status(200).json('message', 'oke');
}

let DeleteCustomer = async (req, res) => {
    let IDCustomer = req.params.item
    await connec.getDB().collection('Customer').deleteMany({ IDCustomer })
    return res.status(200).json('message', 'oke');
}
export default { CustomerPage, importCustomer, UpdateCustomer, DeleteCustomer }