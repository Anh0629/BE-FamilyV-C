const express = require("express");
const router = express.Router();
const { Profile } = require("../modes/profile");
const { User } = require("../modes/user");

// Get all Categories
router.get(`/`, async (req, res) => {
  const profileList = await Profile.find().populate("user");

  if (!profileList) {
    res.status(500).json({ success: false, data: [] });
  }

  res.status(200).json({ success: true, data: profileList });
});


router.get(`/:userid`, async (req, res) => {

  try {
    const profile = await Profile.find({ user: req.params.userid }).populate({ path: 'user', select: 'username email' });

    if (!profile) {
      res.json({ status: false, message: "The User Not Found.", data: null });
    } else {
      res.json({ status: true, message: "Successfull", data: profile });

    }
  } catch (error) {
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
    res.status(500).json({ status: false, message: err.message });
  }
});

module.exports = router;
