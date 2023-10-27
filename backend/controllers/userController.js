const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const { userIndexes } = require('../models/userModel');

const User = require('../models/userModel')





const registerUser = asyncHandler(async (req,res) => {
    const { name, email, password} = req.body
    if(!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const userExists = await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
    // res.json({message: 'Register User'})
});


// // @desc Post users
// // @route POST /api/users
// // @access Private
// const setUser = asyncHandler (async (req, res) => {
//     console.log('Posting User');
//     console.log(req.body)
//     if (!req.body.username && !req.body.email && !req.body.password ) {
//         res.status(400);
//         throw new Error('Please add a username');
//     }  
//     const user = await User.create({
//         username:req.body.username,
//         email:req.body.email,
//         password:req.body.password,

//     });
//     // console.log(json(user));
//     res.status(200).json(user)
// })

const loginUser = asyncHandler( async(req, res) => {
    const {email, password} = req.body;

    // Check for user email
    const user= await User.findOne({email})
    if(user && (bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else{
        res.status(400)
        throw new Error('Invalid credentials')
    }
    // res.json({ message: 'Login User'})
})

// @desc Get user data
// @rotue GET /api/users/me
// @access Private
const getMe = asyncHandler( async(req, res) => {
    const { _id, name, email } = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        name,
        email,
    })
    res.json({message: 'User data display'})
})

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}
// @desc Get users
// @route GET /api/users
// @access Private
const getUsers = asyncHandler (async (req, res) => {
    const {_id, name, email} = await User.findById(req.user.id)
    res.status(200).json({
        id: _id,
        name,
        email
    })
    // const users = await User.find();
    console.log('Getting Users');

    res.status(200).json({message: 'Get Tests'})
})
 


// @desc Put users
// @route PUT /api/users
// @access Private
const updateUser = asyncHandler (async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user) {
        res.status(400);
        throw new Error('User not found');
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true,})
    res.status(200).json(updatedUser)
})

// @desc Delete users
// @route DELETE /api/users
// @access Private
const deleteUser = asyncHandler (async (req, res) => {
    if(!user) {
        res.status(400);
        throw new Error('User not found');
    }


    await user.remove(req.params.id);

    res.status(200).json(req.params.id)
})

module.exports = {
    registerUser,
    loginUser,
    getMe,
    getUsers,
    // setUser,
    updateUser,
    deleteUser
}