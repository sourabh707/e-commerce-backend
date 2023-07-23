const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')


router.get(`/`, async (req, res) =>{
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
})

router.get(`/:id`,async (req, res) => {
    const user = await User.findById(req.params.id).select("-passwordHash");

    if (!user) {
        res.status(500).json({ success: false });
    }
    res.send(user);
})

router.post('/', async(req, res) =>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin
    })
    user = await  user.save();

    if(!user)
    return res.status(404).send('this user cannot be created! ')

    res.send(user);
})

router.post('/log', async(req, res) => {

    try {
        const user = await User.findOne({ email: req.body.email });
        const secret = process.env.secret;
        if (!user) {
          return res.status(404).send('User not found');
        }
    
        if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
            const token = jwt.sign({
                userId : user.id
            },secret, {
                expireIn : '1d'
            })
          return res.status(200).send({user: user.email, token : token });
        } else {
          return res.status(400).send('Wrong password');
        }
      } catch (error) {
        console.error("error dsdkf",error);
        return res.status(500).send('Internal server error');
      }
})

router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id)
        .then((user) => {
            if (user) {
                return res
                    .status(200)
                    .json({
                        success: true,
                        message: 'the user is deleted!',
                    });
            } else {
                return res
                    .status(404)
                    .json({ success: false, message: 'user not found!' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ success: false, error: err });
        });
});


router.get(`/get/count`, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            return res.status(404).json({ success: false, message: "No Users found." });
        }
        res.send({
            userCount: userCount,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});
module.exports =router;