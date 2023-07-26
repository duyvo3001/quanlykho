class Brand {
    constructor({ MaThuongHieu, TenThuongHieu }) {
        if (MaThuongHieu)
            this.MaThuongHieu = MaThuongHieu
        if (TenThuongHieu)
            this.TenThuongHieu = TenThuongHieu
    }
}
class Warehouse {
    constructor({ MaKho, TenKho, DiaChi, SDT }) {
        if (MaKho)
            this.MaKho = MaKho
        if (TenKho)
            this.TenKho = TenKho
        if (DiaChi)
            this.DiaChi = DiaChi
        if (SDT)
            this.SDT = SDT
    }
}
class Stock {
    constructor({ MaLK, Category, TenLK, Donvi, Soluong, MaThuongHieu, MaNCC, Color, MaKho, GiaBanLe, TinhTrangHang }) {
        if (MaLK)
            this.MaLK = MaLK
        if (Category)
            this.Category = Category
        if (TenLK)
            this.TenLK = TenLK
        if (Donvi)
            this.Donvi = Donvi
        if (Soluong)
            this.Soluong = Soluong
        if (MaThuongHieu)
            this.MaThuongHieu = MaThuongHieu
        if (MaNCC)
            this.MaNCC = MaNCC
        if (Color)
            this.Color = Color
        if (MaKho)
            this.MaKho = MaKho
        if (GiaBanLe)
            this.GiaBanLe = GiaBanLe
        if (TinhTrangHang)
            this.TinhTrangHang = TinhTrangHang
    }
}
class Supplier {
    constructor({ MaNCC, TenNCC, DiaChi, SDT, Email }) {
        if (MaNCC) this.MaNCC = MaNCC
        if (TenNCC) this.TenNCC = TenNCC
        if (DiaChi) this.DiaChi = DiaChi
        if (SDT) this.SDT = SDT
        if (Email) this.Email = Email
    }
}
class Customer {
    constructor({ IDCustomer, NameCustomer, Phone, Email }) {
        if (IDCustomer)
            this.IDCustomer = IDCustomer
        if (NameCustomer)
            this.NameCustomer = NameCustomer
        if (Phone)
            this.Phone = Phone
        if (Email)
            this.Email = Email
    }
}
class User {
    constructor({ MaNV, TenNV, NgaySinh, GioiTinh, USER_NV, pass_nv, SDT, Email, DiaChi, accessrights }) {
        if (MaNV)
            this.MaNV = MaNV
        if (TenNV)
            this.TenNV = TenNV
        if (NgaySinh)
            this.NgaySinh = NgaySinh
        if (GioiTinh)
            this.GioiTinh = GioiTinh
        if (USER_NV)
            this.USER_NV = USER_NV
        if (pass_nv)
            this.pass_nv = pass_nv
        if (SDT)
            this.SDT = SDT
        if (Email)
            this.Email = Email
        if (DiaChi)
            this.DiaChi = DiaChi
        if (accessrights)
            this.accessrights = accessrights
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
export class UpdateWarehouseServices extends ServicesUpdate {
    transportClass = Warehouse
}

