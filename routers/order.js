const express = require('express');
const router= express.Router();
const {Order}= require('../modes/orders');
const {OderIterm}=require('../modes/order_Item');
const {User}= require('../modes/user');


router.get(`/`, async (req, res) => {
    const orderList = await Order.find().populate('user').populate({
        path: "orderIterms",
        select:"id quatity",
        populate: {path:"product", select:  "name price image", populate: { path: "category", select: "name" }},
      }).sort('dateOrdered');

    if (!orderList) {
        res.status(500).json({ success: false })
    }
    res.send(orderList)
});

router.get(`/:id`, async (req, res) => {
    const order = await Order.findById(req.params.id).sort('dateOrdered');

    if (!order) {
        res.status(500).json({ success: false })
    }A
    res.send(order)
});

router.post(`/`, async (req, res) => {
const orderItermsIDs= Promise.all(req.body.orderIterms.map(async orderIterm=>{
    let newOderIterm = new OderIterm({
        quatity: orderIterm.quatity,
        product: orderIterm.product,
    })
    newOderIterm= await newOderIterm.save();
    return newOderIterm._id;
}))
    const orderItermsIDsResolved = await orderItermsIDs;

    const totalPrices = await Promise.all(orderItermsIDsResolved.map(async(orderItermIds)=>{
        const orderIterm = await OderIterm.findById(orderItermIds).populate("product","price");
        console.log(orderIterm);
        const totalPrice= orderIterm.product.price * orderIterm.quatity;
        return totalPrice
    }));
    const totalPrice= totalPrices.reduce((a,b) => a+b, 0);
    let order = new Order({
        orderIterms:orderItermsIDsResolved, 
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city:req.body.city,
        zip:req.body.zip,
        country:req.body.country,
        phone1:req.body.phone1,
        phone2:req.body.phone2,
        status:req.body.status,
        totalPrice:totalPrice,
        user: req.body.user,
        profile:req.body.profile,
    })
    order = await order.save()

    if (!order) 
    return res.status(404).send({status: false, message:'Không tồn tại !'})

    res.send(order)
});

router.delete('/:id', (req, res) => {
    Order.findByIdAndRemove(req.params.id)
        .then((order) => {
            if (Order) {
                return res
                    .status(200)
                    .json({ status: true, message: 'Order đã được xoá ~' })
            } else {
                return res
                    .status(404)
                    .json({
                        status: false,
                        message: 'Order không tìm thấy !',
                    })
            }
        })
        .catch((err) => {
            return res.status(400).json({
                error: err,
                status: false,
            })
        })
})


module.exports= router;