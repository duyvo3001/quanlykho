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

    let arrData = [NameCustomer, Phone]

    for (let i = 0; i < arrData.length; i++) {
        if (arrData[i] == '') return res.status(404).json({ message: 'NAME CANT BE NULL' });
    }

    //check special characters

    let e = CheckSpecialCharacters(arrData)
    if (e != false) return res.status(404).json({ error: 'chứa kí tự đặc biệt', Character: e })
    // kiểm tra trùng lập 

    let querycheck = await connec.getDB().collection('Hang').find({ IDCustomer }).toArray()

    //check trùng mã nhập hàng 
    if (Object.keys(querycheck).length == 1)
        return res.status(404).json({ message: 'same id' })

    let data = {
        IDCustomer: Phone, NameCustomer, Phone, Email: Email ? Email : "", NgayTao: Date.now(),
    }
    const result = await connec.getDB().collection("Customer").insertOne(data)

    if (result.acknowledged === true) {
        return res.status(200).json({ message: 'Create product success' });
    }
    else {
        return res.status(500).json({ message: `Can not create Custommer` })
    }

}

let UpdateCustomer = async (req, res) => {

    let { _id, IDCustomer, NameCustomer, Phone, Email } = req.body.formData
    console.info(_id, IDCustomer, NameCustomer, Phone, Email)
    let arrData = [IDCustomer, NameCustomer, Phone, Email]

    //check special characters
    let e = CheckSpecialCharacters(arrData)
    if (e != false) return res.status(404).json({ error: 'chứa kí tự đặc biệt', Character: e })

    let updateCustomerServices = new UpdateCustomerServices()
    let updateCus = updateCustomerServices.getTransport({ IDCustomer, NameCustomer, Phone, Email })
    let fileId = new mongoose.Types.ObjectId(_id);


    //kiểm tra trùng mã lập 
    let querycheck = connec.getDB().collection('Customer').find({ IDCustomer }).toArray()
    if (Object.keys(querycheck).length == 1)
        return res.status(404).json({ message: 'trùng ID' })

    let result = await connec.getDB().collection('Customer').updateOne(
        { _id: fileId }, {
        $set: updateCus
    })
    if (result.acknowledged == true)
        return res.status(200).json({ message: "oke" })
    else
        return res.status(500).json({ message: "eror undefind" })
}

let DeleteCustomer = async (req, res) => {
    let IDCustomer = req.params.item
    await connec.getDB().collection('Customer').deleteMany({ IDCustomer })
    return res.status(200).json({ message: 'oke' });
}

let infoCustomer = async (req, res) => {
    const customerId = req.params.item
    return res.status(200).json({ result: await data.result('Customer', '', customerId, "", "") });
}

export default { CustomerPage, importCustomer, UpdateCustomer, DeleteCustomer, infoCustomer }