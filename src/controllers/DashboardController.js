import connec from '../configs/connectDBmongo.js'

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
    Export
    .map((key) => {
        for (let i = 0; i < key.Product.length; i++) {
            QuantityExport += Number(key.Product[i]?.Qty)
        }
    })

    Inventory
        .filter((key) => {
            if (key?.Soluong != 0) {
                QuantityInventory += key?.Soluong
                return key
            }
        })
        .map((key) => {
            return key
        })
    console.info(QuantityExport)
    let result = {
        Inventory: Inventory.length,
        InventoryQuantity: QuantityInventory,
        Export: Export.length,
        ExportQuantity: QuantityExport
    }
    res.status(200).json({ result })
}

export default { DashBoard }