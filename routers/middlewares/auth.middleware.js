const admin = require('../../firebase')

const authMiddleware = async (req, res, next) => {
    const bearerToken = req.headers['authorization']
    console.log(bearerToken)
    try {
        if (!bearerToken || bearerToken.indexOf('Bearer') !== 0) {
            return res.status(401).json({ message: 'Token invalid!' })
        }
        const token = bearerToken.split(' ')[1]
        req.user = await admin.auth().verifyIdToken(token)
    } catch (error) {
        console.log(error.message)
        return res.status(401).json({ message: 'Token invalid!' })
    }
    next()
}

module.exports = authMiddleware
