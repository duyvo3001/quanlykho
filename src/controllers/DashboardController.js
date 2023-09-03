import connec from '../configs/connectDBmongo.js'
import data from "../services/renderdataHang";

let DashBoard = async (req, res) => {
    let QuantityInventory = 0
    let QuantityExport = 0

    let Inventory = await connec.getDB().collection("Hang").find({
        NgayNhap: {
            $gte: new Date("2023" + "-" + "01" + "-01"),
            $lt: new Date("2023" + "-" + "12" + "-31")
        }
    }).toArray();

    let Export = await connec.getDB().collection("Export").find({
        Date: {
            $gte: new Date("2023" + "-" + "01" + "-01"),
            $lt: new Date("2023" + "-" + "12" + "-31")
        }
    }).toArray();

    let ProductObj = []
    const limit = 16;
    const skip = 0;
    let Product = await data.result('Hang', 'renderData', '', limit, skip)

    Product.map((key, index) => {
        ProductObj.push({
            id: index + 1,
            MaLK: key.MaLK,
            TenLK: key.TenLK,
            Soluong: key.Soluong,
            NgayNhap : key.NgayNhap,
            TinhTrangHang: key.TinhTrangHang
        });
    })

    Export
        .map((key) => {
            for (let i = 0; i < key.Product.length; i++) {
                QuantityExport += Number(key.Product[i]?.Qty)
            }
        })

    Inventory
        .filter((key) => {
            if (key?.Soluong != 0) {
                QuantityInventory +=  Number(key?.Soluong)
                return key
            }
        })
        .map((key) => {
            return key
        })

    let result = {
        Inventory: Inventory.length,
        InventoryQuantity: QuantityInventory,
        Export: Export.length,
        ExportQuantity: QuantityExport
    }
    res.status(200).json({ result, ProductObj })
}

export default { DashBoard }