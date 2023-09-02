import jwt from 'jsonwebtoken';

const use = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

//create middleware access right handler
const AccessHandler = (type, action) => {
    return (req, res, next) => {
        const token = req.headers?.authorization
        const data = jwt.verify(token, process.env.ACCESS_TOKEN)
        const dataAccess = data?.accessrights?.[type]?.[action]
        if (dataAccess == false || dataAccess == undefined) {
            return res.status(403).json({ message: "not allowed" })
        }
        next()
    }
}

// middleware authentoken handler
const authenToken = (req, res, next) => {
    const token = req.headers?.authorization
    // console.info(token)
    if (!token)
        return res.status(401).json({ message: 'k co token' })

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, data) => {
        if (err) { return res.status(401).json({ message: 'sai token' }) }
        next();
    })

}

module.exports = {
    use, authenToken, AccessHandler
}