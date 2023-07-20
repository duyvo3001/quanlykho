import connec from '../configs/connectDBmongo.js'

let getInventoryReport = async (req, res) => {
  const { item } = req.params
  // let month = {
  //   'January',
  //   'February',
  //   'March',
  //   'April',
  //   'June',
  //   'July',
  //   'August',
  //   'September',
  //   'October',
  //   'November',
  //   'December ',
  // }
  // console.log(req.params);
  let datarender = await connec.getDB().collection("Hang").find({
    NgayNhap: { $gte: new Date(item + "-01-01"), $lt: new Date(item + "-12-31") }
  }).toArray();
  console.log(datarender);
  // xep du lieu vao thang 1 => thang 12
  // kiem tra hang nhap con hang hay k

  res.status(200).json({ result: datarender })
}
export default { getInventoryReport }