class Brand {
    constructor({ MaThuongHieu, TenThuongHieu }) {
        this.MaThuongHieu = MaThuongHieu || null
        this.TenThuongHieu = TenThuongHieu || null
    }
}
class Stock {
    constructor({ MaLK, TenLK, Donvi, Soluong, MaThuongHieu, MaNCC, Color, MaKho, GiaBanLe, TinhTrangHang }) {
        this.MaLK = MaLK || null
        this.TenLK = TenLK || null
        this.Donvi = Donvi || null
        this.Soluong = Soluong || null
        this.MaThuongHieu = MaThuongHieu || null
        this.MaNCC = MaNCC || null
        this.Color = Color || null
        this.MaKho = MaKho || null
        this.GiaBanLe = GiaBanLe || null
        this.TinhTrangHang = TinhTrangHang || null
    }
}
class Supplier {
    constructor({ MaNCC, TenNCC, DiaChi, SDT, Email }) {
        this.MaNCC = MaNCC || null
        this.TenNCC = TenTenNCCLK || null
        this.DiaChi = DiaChi || null
        this.SDT = SDT || null
        this.Email = Email || null
    }
}
class Customer {
    constructor({ IDCustomer, NameCustomer, Phone, Email }) {
            this.IDCustomer = IDCustomer|| null
            this.NameCustomer = NameCustomer|| null
            this.Phone = Phone|| null
            this.Email = Email|| null
    }
}
class User {
    constructor({ MaNV, TenNV, NgaySinh, GioiTinh, USER_NV, pass_nv, SDT, Email, DiaChi, accessrights }) {
            this.MaNV = MaNV|| null
            this.TenNV = TenNV|| null
            this.NgaySinh = NgaySinh|| null
            this.GioiTinh = GioiTinh|| null
            this.USER_NV = USER_NV|| null
            this.pass_nv = pass_nv|| null
            this.SDT = SDT|| null
            this.Email = Email|| null
            this.DiaChi = DiaChi|| null
            this.accessrights = accessrights|| null
    }
}
class ServicesUpdate {
    transportClass = Brand
    getTransport = (InfoItem) => {
        return new this.transportClass(InfoItem)
    }
}
export class UpdateItemBrandServices extends ServicesUpdate {
    transportClass = Brand
}
export class UpdateItemStockServices extends ServicesUpdate {
    transportClass = Stock
}
export class UpdateItemSupplierServices extends ServicesUpdate {
    transportClass = Supplier
}
export class UpdateCustomerServices extends ServicesUpdate {
    transportClass = Customer
}
export class UpdateUserServices extends ServicesUpdate {
    transportClass = User
}

