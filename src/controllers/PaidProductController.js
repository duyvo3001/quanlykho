import connec from '../configs/connectDBmongo.js'
import modelHoaDon from '../models/HoaDon.model.js';

const paidProduct = async (req, res) => {
    // update qty of product
    let { searchCustomer, Discount } = req.body.formData;
    let Product = []

    await req.body.Render?.map((key) => {
        Product.push({ NameProduct: key.NameProduct, Qty: key.Qty })
    })

    const IDPaidOrder = await createIDPaid()

    let data = {
        IDPaidOrder, searchCustomer, Discount, Product, Date: Date.now()
    }

    const result = await connec.getDB().collection("HoaDon").insertOne(data)
    console.info(result)
    await res.status(200).json({ message: 'oke' });
}


const createIDPaid = async () => {
    return Math.floor(Math.random() * Math.floor(Math.random() * Date.now())).toString(16)
}

export default { paidProduct }