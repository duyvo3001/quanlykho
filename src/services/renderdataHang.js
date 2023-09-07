import connec from '../configs/connectDBmongo.js'

// render data from table Hang 
const result = async (kind, key, value, limit, skip) => {

    const Renderdata = async () => await check();

    const check = async () => {
        let query = null;
        switch (key) {
            case 'renderData':
                query = await connec.getDB().collection(kind).find().sort({ NgayNhap: -1 }).limit(limit).skip(skip).toArray();
                break;
            case 'renderDatanull':
                query = [];
                break;
            default:
                switch (kind) {
                    case 'ThuongHieu':
                        query = await connec.getDB().collection(kind).find({ MaThuongHieu: value }).toArray();
                        break;
                    case 'Hang':
                        query = await connec.getDB().collection(kind).find({ MaLK: value }).toArray();
                        break;
                    case 'Customer':
                        query = await connec.getDB().collection(kind).find({ IDCustomer: value }).toArray();
                        break;
                    case 'Export':
                        query = await connec.getDB().collection(kind).find({ IDPaidOrder: value }).toArray();
                        break;
                    case 'Category':
                        query = await connec.getDB().collection(kind).find({ Category: value }).toArray();
                        break;
                    case 'NhanVien':
                        query = await connec.getDB().collection(kind).find({ MaNV: value }).toArray();
                        break;
                    default:
                        query = await connec.getDB().collection(kind).find({ MaNCC: value }).toArray();
                        break;
                }
                break;
        }
        return query;
    }
    return Renderdata()
}

export default { result };