import connec from '../configs/connectDBmongo.js'
import modelHoaDon from '../models/HoaDon.model.js';

const paidProduct = async (req, res) => {
    let { searchCustomer, Discount } = req.body.formData;
    let Product = []
    await req.body.Render?.map((key) => {
        Product.push({ NameProduct: key.NameProduct, Qty: key.Qty })
    })
    console.log(await createIDPaid())
    // can chuyen du lieu vao data S
    // lap Id Hoadon 
    // gui du lieu vao mongodb

    let data = {
        searchCustomer, Discount, Product
    }

    const checkData = await connec.getDB().collection("HoaDon").find({}).toArray();

    console.info(checkData)
    // }
    const result = await connec.getDB().collection("HoaDon").insertOne(data)
    // await modelHoaDon.HoaDonmodel(data)
    await res.status(200).json({ message: 'oke' });
}

const createIDPaid = async () => {
    return await connec.getDB().collection("HoaDon").find().toArray();
}

export default { paidProduct }