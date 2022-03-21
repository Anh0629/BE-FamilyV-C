const express = require("express");
const router = express.Router();
const { Profile } = require("../modes/profile");
const { User } = require("../modes/user");

// Get all Categories
router.get(`/`, async (req, res) => {
  const profileList = await Profile.find().populate("user");

  if (!profileList) {
    // Chỗ thày thiếu return, không thì nó trả response 2 lần => lỗi crash backend
    res.status(500).json({ success: false, data: [] });
  }

  res.status(200).json({ success: true, data: profileList });
});


router.get(`/:userid`, async (req, res) => {

  // Cái này okela nè
  try {
    const profile = await Profile.find({ user: req.params.userid }).populate({ path: 'user', select: 'username email' });

    if (!profile) {
      // Tuy nhiên nếu lỗi thì trả status >400 < 500
      res.json({ status: false, message: "The User Not Found.", data: null });
    } else {
      res.json({ status: true, message: "Successfull", data: profile });

    }
  } catch (error) {
    // Thiếu status = 500 vì không bắt được
    res.json({ status: false, message: err.message, data: null })
  }
});


//get theo id user trong profiles
// router.get(`/user/:id`, async(req, res)=>{
//   const user = await User.findById(req.body.id)
//   if(!user){
//     return res.status(500).json({success: false, message:"khong lay dc", data: null });
//   }
//   res.status(200).json({success:true, data: null})
// });


router.post(`/post`, async (req, res) => {
  try {
    const user = await User.findById(req.body.user);
    // Tiết kiệm 1 tab bằng cách dùng return
    // if (!user){
    //  return xxx 
    // }
    // do stuff without else
    if (!user) {
      res.json({ status: false, message: "The Username Not Found" });
    } else {
      let profile = new Profile({
        user: req.body.user,
        name: req.body.name,
        phone: req.body.phone,
        address: {
          street: req.body.address.street,
          city: req.body.address.city,
          province: req.body.address.province,
          state: req.body.address.state,
        },
      });

      // Đã await thì không dùng then
      profile = await profile
        .save()
        .then(() => {
          res.status(200).json({ status: true, data: profile });
        })
        .catch((err) => {
          res.json({
            status: false,
            message: err.message,
          });
        });
    }
  } catch (err) {
    // Chỗ này có status 500 okela quá nè
    res.status(500).json({ status: false, message: err.message });
  }
});

module.exports = router;
