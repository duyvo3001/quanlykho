import connec from "../configs/connectDBmongo.js";
import data from "../services/renderdataHang.js";
const SearchStock = async (req, res) => {
  let datarender = await connec.getDB().collection("Hang").find({}).toArray();

  if (datarender == null) {
    return res.status(500).json({ message: "null!" });
  }

  return res.status(200).json({ result: datarender });
};
const SearchCustomer = async (req, res) => {
  let datarender = await connec
    .getDB()
    .collection("Customer")
    .find({})
    .toArray();

  if (datarender == null) {
    return res.status(500).json({ message: "null!" });
  }

  return res.status(200).json({ result: datarender });
};
const SearchStockExport = async (req, res) => {
  let datarender = await connec.getDB().collection("Hang").find({}).toArray();

  if (datarender == null) {
    return res.status(500).json({ message: "null!" });
  }

  return res.status(200).json({ result: datarender });
};

const SearchBrand = async (req, res) => {
  let datarender = await connec
    .getDB()
    .collection("ThuongHieu")
    .find({})
    .toArray();

  if (datarender == null) {
    return res.status(500).json({ message: "null!" });
  }

  return res.status(200).json({ result: datarender });
};

const SearchWarehouse = async (req, res) => {
  let datarender = await connec
    .getDB()
    .collection("KhoHang")
    .find({})
    .toArray();

  if (datarender == null) {
    return res.status(500).json({ message: "null!" });
  }

  return res.status(200).json({ result: datarender });
};
const SearchSupplier = async (req, res) => {
  let datarender = await connec.getDB().collection("NCC").find({}).toArray();

  if (datarender == null) {
    return res.status(500).json({ message: "null!" });
  }

  return res.status(200).json({ result: datarender });
};

const SearchInvoice = async (req, res) => {
  let datarender = await connec
    .getDB()
    .collection("Export")
    .find({})
    .sort({ Date: +1 })
    .toArray();

  if (datarender == null) {
    return res.status(500).json({ message: "null!" });
  }

  return res.status(200).json({ result: datarender });
};

const SearchDateProduct = async (req, res) => {
  let datarender = await connec
    .getDB()
    .collection("Hang")
    .find({
      NgayNhap: { $gte: new Date("2023-6-01"), $lt: new Date("2023-07-01") },
    })
    .toArray();
  return res.status(200).json({ result: datarender });
};

const SearchUser = async (req, res) => {
  let datarender = await connec
    .getDB()
    .collection("NhanVien")
    .find({})
    .toArray();

  if (datarender == null) {
    return res.status(500).json({ message: "null!" });
  }

  return res.status(200).json({ result: datarender });
};
const SearchCategory = async (req, res) => {
  let datarender = await connec
    .getDB()
    .collection("Category")
    .find({})
    .toArray();

  if (datarender == null) {
    return res.status(500).json({ message: "null!" });
  }

  return res.status(200).json({ result: datarender });
};
const SearchDetailProduct = async (req, res) => {
  const { MaLK } = req.params.id;
  console.log(req)
  res.status(200).json({ result: await data.result("Hang", "", MaLK, "", "") });
};
export default {
  SearchDetailProduct,
  SearchCategory,
  SearchUser,
  SearchDateProduct,
  SearchStock,
  SearchStockExport,
  SearchCustomer,
  SearchBrand,
  SearchWarehouse,
  SearchInvoice,
  SearchSupplier,
};
