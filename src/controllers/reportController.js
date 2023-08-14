import connec from '../configs/connectDBmongo.js'
import { UpdateItemStockServices } from '../services/UpdateItem.js'

let getInventoryReport = async (req, res) => {
  const { MaLK, Category, MaThuongHieu, MaKho, TinhTrangHang } = req.body.formData
  let { TenLK, MaNCC, Color, Donvi, Soluong, GiaBanLe } = ""

  let updateItemStockServices = new UpdateItemStockServices()
  let updateItem = updateItemStockServices.getTransport(
    {
      MaLK, Category, TenLK, MaThuongHieu, MaNCC,
      Color, Donvi, Soluong, MaKho, GiaBanLe, TinhTrangHang
    })

  let datarender = await connec.getDB().collection("Hang").find(updateItem)
    .sort({ NgayNhap: -1 }).toArray();

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
    NgayNhap: {
      $gte: new Date(year + "-" + (Month != 0 ? Month : "01") + "-01"),
      $lt: new Date(year + "-" + (Month != 0 ? Month : "12") + "-31")
    }
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
  const { year } = req.params
  const uData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  let datarender = await connec.getDB().collection("Export").find(
    {
      Date: {
        $gte: new Date(year + "-" + "01" + "-01"),
        $lt: new Date(year + "-" + "12" + "-31")
      }
    }
  ).toArray();
  datarender.map((key) => {
    const date = new Date(key?.Date);
    const month = date.getMonth()
    for (let i = 0; i <= 11; i++) {
      if (month == i) {
        for (let i = 0; i < key.Product.length; i++) {
          uData[month] += Number(key.Product[i].Qty)
        }
      }
    }
  })
  res.status(200).json({ result: datarender, uData });
}

let CategoryReport = async (req, res) => {
  const { year } = req.params
  const uDataCategory = [];
  const labelCategory = []

  //get category 
  let datarender = await connec.getDB().collection("Category").find({}).toArray()
  datarender.map((key) => labelCategory.push(key.Category))
  labelCategory.sort()

  //get Hang
  let dataProduct = await connec.getDB().collection("Hang").find({}).toArray()

  // dataExport
  let dataExport = await connec.getDB().collection("Export").find(
    {
      Date: {
        $gte: new Date(year + "-" + "01" + "-01"),
        $lt: new Date(year + "-" + "12" + "-31")
      }
    }
  ).toArray()

  // set null data for uData 
  labelCategory.map((key) => {
    uDataCategory.push(0)
  })

  // set data for uData
  labelCategory.map((key) => {
    dataProduct.map((data) => {
      if (key === data.Category) {
        dataExport.map((key1) => {
          for (let i = 0; i < key1.Product.length; i++) {
            if (key1.Product[i].IDProduct === data.MaLK) {
              uDataCategory[labelCategory.indexOf(key)] += Number(key1.Product[i].Qty)
            }
          }
        })
      }
    })
  })

  res.status(200).json({ uDataCategory, labelCategory });
}

let BrandReport = async (req, res) => {
  const { year } = req.params
  const uDataBrand = [];
  const labelBrand = []

  //get category 
  let datarender = await connec.getDB().collection("ThuongHieu").find({}).toArray()
  datarender.map((key) => labelBrand.push(key.MaThuongHieu))
  labelBrand.sort()


  //get Hang
  let dataProduct = await connec.getDB().collection("Hang").find({}).toArray()

  // dataExport
  let dataExport = await connec.getDB().collection("Export").find(
    {
      Date: {
        $gte: new Date(year + "-" + "01" + "-01"),
        $lt: new Date(year + "-" + "12" + "-31")
      }
    }
  ).toArray()

  // set null data for uData 
  labelBrand.map((key) => {
    uDataBrand.push(0)
  })

  // set data for uData
  labelBrand.map((key) => {
    dataProduct.map((data) => {
      if (key === data.MaThuongHieu) {
        dataExport.map((key1) => {
          for (let i = 0; i < key1.Product.length; i++) {
            if (key1.Product[i].IDProduct === data.MaLK) {
              uDataBrand[labelBrand.indexOf(key)] += Number(key1.Product[i].Qty)
            }
          }
        })
      }
    })
  })
  res.status(200).json({ uDataBrand, labelBrand });
}

export default { BrandReport, CategoryReport, getInventoryReport, getSaleReport, getOutofStock }