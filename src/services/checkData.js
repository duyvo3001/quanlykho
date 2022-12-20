//check data input
export const searchfunc = (search) => {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (format.test(search)) {
        return true;
    } else {
        return false;
    }
}
export const checkfunc = (arrLinhKien) => {
    let arrCheck = [];
    for (let i = 0; i < arrLinhKien.length; i++) {
        if (searchfunc(arrLinhKien[i]))
        arrCheck.push(arrLinhKien[i])
    }
    return arrCheck;
}
