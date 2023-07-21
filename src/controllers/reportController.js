import connec from '../configs/connectDBmongo.js'

let getInventoryReport = async (req, res) => {
  const { year, Month } = req.params

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
    NgayNhap: { $gte: new Date(year + "-" + (Month != 0 ? Month : "01") + "-01"), $lt: new Date(year + "-" + (Month != 0 ? Month : "12") + "-31") }
  }).toArray();

  const result = datarender
    .filter((key) => {
      if (key?.Soluong != 0)
        return key
    })
    .map((key) => {
      return key
    })

  // xep du lieu vao thang 1 => thang 12
  console.log(result)

  res.status(200).json({ result })
}
export default { getInventoryReport }