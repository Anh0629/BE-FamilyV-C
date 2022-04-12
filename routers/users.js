const express = require('express')
const req = require('express/lib/request')
const res = require('express/lib/response')
const router = express.Router()
const { User } = require('../modes/user')
const authMiddleware = require('./middlewares/auth.middleware')

router.get('/me', authMiddleware, (req, res) => {
    console.log(req.user.name, req.user.picture, req.user.email)
    return res.json(req.user)
})

router.get(`/`, async (req, res) => {
    const userList = await User.find()
    res.send(userList)
})

router.get(`/:id`, async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return res.status(500).json({
            status: false,
            message: 'Id Not Found!',
            data: { id: null },
        })
    }
    if (user) {
        res.send(user)
    }
})

// cap nhat
router.patch(`/:email`, async (req, res) => {
    const user = await User.findOne({ email: req.params.email })

    if (!user) {
        return res.json({
            message: 'khong tim thấy user',
            success: false,
            status: false,
        })
    } else if (req.body.currentPassword != user.passwordHash) {
        return res.json({ message: 'Curent Password không đúng' })
    }
    user.passwordHash = req.body.password
    user.save()
    res.send(user)
})

router.delete(`/delete/:id`, async (req, res) => {
    // Da await thi khong xai then trong nay
    await User.findByIdAndRemove(req.params.id)
        .then((user) => {
            // Dua het cai nay ra ngoai
            if (user) {
                return res.status(200).json({
                    Success: true,
                    Message: 'The User Has Been Deleted!',
                })
            } else {
                return res
                    .status(403)
                    .json({ Success: false, Message: 'The User Not Found!' })
            }
        })
        .catch((err) => {
            return res
                .status(500)
                .json({ Success: false, Message: err.message })
        })
})

router.post(`/create`, authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email })
        console.log(user)
        if (user == null) {
            const newUser = new User({
                username: req.user.username,
                email: req.user.email,
                passwordHash: req.user.email,
                //isAdmin: req.user.isAdmin,
            })
            await newUser.save()
            console.log(newUser)
            res.send(newUser)
        } else {
            return res.json({ success: false })
        }
    } catch (err) {
        return res.json({ message: err.message, success: false })
    }
})

router.post(`/register`, async (req, res) => {
    // Xai promise, khong xai callback lẫn lộn trong này
    User.findOne({ email: req.body.email }, (err, user) => {
        // Cái này là callback, nên dùng await
        if (err) {
            return res.status(500).json({ error: err.message })
        } else {
            if (user == null) {
                const user = new User({
                    username: req.body.username,
                    email: req.body.email,
                    passwordHash: req.body.password,
                    isAdmin: req.body.isAdmin,
                })

                // Cái này nên xài await, không xài then
                user.save()
                    .then(() => {
                        res.status(200).send({ status: true, user: user })
                    })
                    .catch((err) => {
                        res.status(403).json({
                            success: false,
                            message: err.message,
                        })
                    })
            } else {
                // status nên là > 400 < 500
                return res.json({
                    status: false,
                    message: 'Email has been already',
                })
            }
        }
    })
})

//Post User - Login
router.post(`/login`, async (req, res) => {
    // try này vô ngĩa, tại vì không dùng async await thì không try catch được
    try {
        User.findOne(
            {
                $or: [
                    { email: req.body.email },
                    { username: req.body.username },
                ],
            },
            (err, user) => {
                if (err) {
                    // Lỗi nó nhảy vào đây, nó không nhảy vào try/catch
                    return res.json({ status: false, message: err.message })
                } else {
                    if (user === null) {
                        if (req.body.email != null) {
                            return res.json({
                                status: false,
                                message: 'The Email Not Found',
                                data: {
                                    id: null,
                                },
                            })
                        } else {
                            return res.json({
                                status: false,
                                message: 'The Username Not Found',
                                data: {
                                    id: null,
                                },
                            })
                        }
                    } else {
                        if (user.passwordHash == req.body.password) {
                            return res.json({
                                status: true,
                                message: 'Login Successfully',
                                data: {
                                    id: user._id,
                                    isAdmin: user.isAdmin,
                                    username: user.username,
                                    email: user.email,
                                },
                            })
                        } else {
                            return res.json({
                                status: false,
                                message: 'Password is wrong!',
                                data: {
                                    id: user._id,
                                    isAdmin: user.isAdmin,
                                    username: user.username,
                                    email: user.email,
                                },
                            })
                        }
                    }
                }
            }
        )
    } catch (err) {
        // Catch này không bao giờ chạy
        return res.json({ status: false, message: err.message })
    }
})
module.exports = router
