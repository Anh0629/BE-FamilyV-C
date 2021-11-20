const express = require('express');
const router = express.Router();
const { User } = require('../modes/user');

router.get(`/`, async (req, res) => {
    const userList = await User.find();

    if (!userList) {
        return res.status(500).json({ success: false });
    }

    res.send(userList);
});


router.get(`/:id`, async (req, res) => {
    const userList = await User.findById(req.params.id);

    if (!userList) {
        return res.status(500).json(
          { status: false , 
            message:"không tìm thấy theo ID", 
            data:{id: null}
          });
    }           
    res.send(userList);
});

router.delete(`/delete/:id`, async (req, res) => {
    await User.findByIdAndRemove(req.params.id).then((user) => {
        if (user) {
            return res.status(200).json({ Success: true, Message: 'The User Has Been Deleted!' });
        } else {
            return res.status(403).json({ Success: false, Message: 'The User Not Found!' });
        }
    }).catch((err) => {
        return res.status(500).json({ Success: false, Message: err.message });
    });
});
    

// cap nhat 
router.patch(`/:email`, async(req,res ) => {
const user = await User.findOneAndUpdate(
    req.params.email,
    {
        passwordHash: req.body.passwordHash,
    });

    if(!user)
        return res.status(404).send('Không thể sửa passwordHash');

    res.send(user);
});

router.post(`/register`, async (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } 
    else {
      if (user == null) {
          
        const user = new User({
          username: req.body.username,
          email: req.body.email,
          passwordHash: req.body.password,
          isAdmin: req.body.isAdmin,
        });

        user
          .save()
          .then(() => {
            res.status(200).send({ status: true, user: user });
          })
          .catch((err) => {
            res.status(403).json({ success: false, message: err.message });
          });
      } else {
            return res.json({ status: false, message: "Email has been already" });
      }
    }
  });
});

//Post User - Login
router.post(`/login`, async (req, res) => {
    try {
        // const secret = process.env.secret;
    
        User.findOne(
          { $or: [{ email: req.body.email }, { username: req.body.username }] },
          (err, user) => {
            if (err) {
              return res.json({ status: false, message: err.message });
            } else {
              if (user === null) {
                if (req.body.email != null) {
                  return res.json({
                    status: false,
                    message: "The Email Not Found",
                    data: {
                      id: null,
                    }
                  });
                } else {
                  return res.json({
                    status: false,
                    message: "The Username Not Found",
                    data: {
                      id: null,
                    }
                  });
                }
              } else {
                if (user.passwordHash == req.body.password) {             
                  return res.json({
                    status: true,
                    message: "Login Successfully",
                    data: {
                      id: user._id,
                      isAdmin: user.isAdmin,
                      username : user.username
                    }
                  });
                } else {
                  return res.json({
                    status: false,
                    message: "Password is wrong!",
                    data: {
                      id: user._id,
                      isAdmin: user.isAdmin,
                      username : user.username
                    }
                  });
                }
              }
            }
          }
        );
      } catch (err) {
        return res.json({ status: false, message: err.message });
      }
});
module.exports = router;
