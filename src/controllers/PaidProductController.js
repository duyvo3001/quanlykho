import connec from '../configs/connectDBmongo.js'
import data from "../services/renderdataHang";

const paidProduct = async (req, res) => { // Paid Product 
    let { IDCustomer, Discount } = req.body.formData;
    let { Render } = req.body

    // const getdata = async (data1) => {
    //     return await data?.result('Hang', '', data1, "", "")
    // }
    let Product = []
    let _data = []
    for (let i = 0; i < Render.length; i++) {
        _data.push(await data?.result('Hang', '', Render[i]?.NameProduct, "", ""))
        Product.push(
            {
                IDProduct: Render[i]?.NameProduct,
                NameProduct: await _data[i][0]?.TenLK,
                Qty: Render[i]?.Qty,
                GiaBanLe: await _data[i][0]?.GiaBanLe
            }
        )
    }

    const IDPaidOrder = await createIDPaid() // create ID Paid Order

    let dataInvoice = {
        IDPaidOrder, IDCustomer, Discount, Product, Date: Date.now()
    }

    const Resultdata = await connec.getDB().collection("HoaDon").insertOne(dataInvoice)
    console.info(Resultdata)
    if (Resultdata.acknowledged == true) {
        updateQty(Render, connec) // update Qty Product
        return res.status(200).json({ message: "Insertion successful!" });
    } else {
        return res.status(404).json({ message: "Insertion failed" });
    }
    // return res.status(200).json()
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
    return res.status(200).json({ result: await data.result('HoaDon', 'renderData', '', limit, skip) });
}

const getInvoice = async (req, res) => {
    const invoice = req.params.invoice
    return res.status(200).json({ result: await data.result('HoaDon', '', invoice, '', '', '') })
}
const DeleteOrder = async (req, res) => {
    const IDPaidOrder = req.params.item
    await connec.getDB().collection('HoaDon').deleteMany({ IDPaidOrder })
    res.status(200).json({ message: 'delete sucsess' })
}
export default { paidProduct, managePaid, getInvoice ,DeleteOrder}