import connec from '../configs/connectDBmongo.js'
import modelHoaDon from '../models/HoaDon.model.js';

const paidProduct = async (req, res) => {
    let { searchCustomer, Discount } = req.body.formData;
    await req.body.Render?.map((key) => {
        console.log(key);
    })
    console.log(await createIDPaid())
    // can chuyen du lieu vao data 
    // lap Id Hoadon 
    // gui du lieu vao mongodb
    // let data = {

    // }

    // await modelHoaDon.HoaDonmodel(data)
    await res.status(200).json({ message: 'oke' });
}

const createIDPaid = async () => {
    return await connec.getDB().collection("HoaDon").find().toArray();
}

export default { paidProduct }