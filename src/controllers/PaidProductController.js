import connec from '../configs/connectDBmongo.js'
import data from "../services/renderdataHang";

const paidProduct = async (req, res) => { // Paid Product 
    let { searchCustomer, Discount } = req.body.formData;
    let { Render } = req.body
    let Product = []

    await Render?.map((key) => { // push the paid Product to array
        Product.push({ NameProduct: key.NameProduct, Qty: key.Qty })
    })

    const IDPaidOrder = await createIDPaid() // create ID Paid Order

    let data = {
        IDPaidOrder, searchCustomer, Discount, Product, Date: Date.now()
    }

    const result = await connec.getDB().collection("HoaDon").insertOne(data)
    console.info(result)
    if (result.acknowledged == true) {
        updateQty(Render, connec) // update Qty Product
        return res.status(200).json({ message: "Insertion successful!" });
    } else {
        return res.status(404).json({ message: "Insertion failed" });
    }
}

const updateQty = async (Render, connec) => { // update Qty of Product 
    await Render?.map(async (key) => {
        const QtyOfproductHang = await connec.getDB().collection("Hang").find({ MaLK: key.NameProduct }).toArray()
        const QtyUpdate = QtyOfproductHang[0]?.Soluong - key.Qty

        connec.getDB().collection('Hang').updateOne(
            { MaLK: key.NameProduct }, {
            $set: {
                Soluong: QtyUpdate
            }
        });
    })
}

const createIDPaid = async () => { // create radom ID Paidorder
    return Math.floor(Math.random() * Math.floor(Math.random() * Date.now())).toString(16)
}

const managePaid = async (req, res) => {
    const pageIndex = req.params.pageIndex || 1;
    const limit = 16;
    const skip = (pageIndex - 1) * limit;
    console.log(await data.result('HoaDon', 'renderData', '', limit, skip));
    return res.status(200).json({ result: await data.result('HoaDon', 'renderData', '', limit, skip) });
}
export default { paidProduct ,managePaid }