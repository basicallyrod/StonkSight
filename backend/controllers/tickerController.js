const asyncHandler = require('express-async-handler');

const List = require('../models/listModel')
const User = require('../models/userModel')


// @desc Put lists
// @route PUT /api/lists
// @access Private
const updateList = asyncHandler (async (req, res) => {
    const list = await List.find({
        user: req.params.id,
        listName: req.body.listName,
    });


    if(!list) {
        res.status(400);
        throw new Error('List not found');
    }

    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }
    if(list.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    // const possibleLists = await List.findById

    const updatedList = await List.findByIdAndUpdate(req.params.id, req.body, {new: true,})
    res.status(200).json(updatedList)
})

const addTicker = asyncHandler (async (req, res) => {
    const list = await List.find({
        user: req.params.id,
        listName: req.body.listName,
    });

    if(!list) {
        res.status(400);
        throw new Error('List not found');
    }

    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }
    if(list.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updateList = await List.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).json(updatedList)
})