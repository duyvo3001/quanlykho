import connec from '../configs/connectDBmongo.js'
import data from "../services/renderdataHang";

const handledata = () => {

}

const paidProduct = async (req, res) => { // Paid Product 
    let { IDCustomer, Discount } = req.body.formData;
    let { Render } = req.body

    const getdata = async (data1) => {
        return await data.result('Hang', '', data1, "", "")
    }
    
    let Product = await Render?.map(async (key) => {
        let _data = await getdata(key.NameProduct)

        return await {
            IDProduct: key.NameProduct,
            NameProduct: await _data[0].TenLK,
            Qty: key.Qty,
            GiaBanLe: await _data[0].GiaBanLe
        }
    })

    // let data =  Render?.map((key) => { // push the paid Product to array
    //     console.log(key.NameProduct)
    //     let dataProduct = await data?.result('Hang', '', key.NameProduct, "", "")
    //     let { TenLK, GiaBanLe } = await dataProduct
    //     console.log(await dataProduct)
    //     return await (
    //         {
    //             IDProduct: key.NameProduct,
    //             NameProduct: TenLK,
    //             Qty: key.Qty,
    //             GiaBanLe: GiaBanLe
    //         })
    // })

    // console.log(await data)

    const IDPaidOrder = await createIDPaid() // create ID Paid Order

    let data = {
        IDPaidOrder, IDCustomer, Discount, Product, Date: Date.now()
    }

    const Result = await connec.getDB().collection("HoaDon").insertOne(data)
    console.info(Result)
    if (Result.acknowledged == true) {
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

export default { paidProduct, managePaid, getInvoice }