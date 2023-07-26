import connec from '../configs/connectDBmongo.js'
import { UpdateItemStockServices } from '../services/UpdateItem.js'

let getInventoryReport = async (req, res) => {
  const { Category, MaThuongHieu, MaKho, TinhTrangHang } = req.body.formData

  let { MaLK, TenLK, MaNCC, Color, Donvi, Soluong, GiaBanLe } = ""

  let updateItemStockServices = new UpdateItemStockServices()
  let updateItem = updateItemStockServices.getTransport({MaLK, Category, TenLK, MaThuongHieu, MaNCC, Color, Donvi, Soluong, MaKho, GiaBanLe, TinhTrangHang})

  let datarender = await connec.getDB().collection("Hang").find(updateItem).sort({ NgayNhap: -1 }).toArray();

  const result = datarender
    .filter((key) => {
      if (key?.Soluong != 0)
        return key
    })
    .map((key) => {
      return key
    })

  res.status(200).json({ result })
}

let getOutofStock = async (req, res) => {
  const { year, Month } = req.params

  let datarender = await connec.getDB().collection("Hang").find({
    NgayNhap: { $gte: new Date(year + "-" + (Month != 0 ? Month : "01") + "-01"), $lt: new Date(year + "-" + (Month != 0 ? Month : "12") + "-31") }
  }).sort({ NgayNhap: -1 }).toArray();

  const result = datarender
    .filter((key) => {
      if (key?.Soluong == 0)
        return key
    })
    .map((key) => {
      return key
    })

  res.status(200).json({ result })
}

let getSaleReport = async (req, res) => {
  const { year, Month } = req.params
  const uData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  let datarender = await connec.getDB().collection("HoaDon").find(
    {
      Date: {
        $gte: new Date(year + "-" + (Month != 0 ? Month : "01") + "-01"),
        $lt: new Date(year + "-" + (Month != 0 ? Month : "12") + "-31")
      }
    }
  ).toArray();

  function pushArr() {
    datarender.map((key) => {
      const date = new Date(key?.Date);
      const month = date.getMonth()
      for (let i = 0; i <= 11; i++) {
        if (month == i) {
          uData[i] += key.NetAmount
        }
      }
    })
  }

  if (Month == 0) {
    pushArr()
  }
  else {
    pushArr()
  }

  res.status(200).json({ result: datarender, uData });
}

export default { getInventoryReport, getSaleReport, getOutofStock }