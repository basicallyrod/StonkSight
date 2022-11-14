const asyncHandler = require('express-async-handler');

const List = require('../models/listModel')
const User = require('../models/userModel')
// @desc Get lists
// @route GET /api/lists
// @access Private
const getLists = asyncHandler (async (req, res) => {
    const lists = await List.find({user: req.user.id})
    // const lists = await List.find();f
    // console.log('Getting Lists');
    console.log(`listController getLists: ${req.user.id}`)
    // console.log(res)
    res.status(200).json(lists)
})
 
// @desc Post lists
// @route POST /api/lists
// @access Private

const setList = asyncHandler (async (req, res) => {
    console.log('Posting List');
    const { listName } = req.body
    // const { listName} = req.body
    console.log(`setList ${req.body.listName}`)
    console.log(`setList ${req.user.id}`)
    
    // const userExists = await User.findOne(req.user.id)
    // const listExists = await List.findOne(listName)

    // if(userExists && listExists) {
    //     throw new Error('The list already exists!')
    // }

    if (!req.body.listName) {
        res.status(400);
        throw new Error('Please add a listname');
    }  
    // console.log('setList')
    const list = await List.create({
        user: req.user.id,
        listName: listName,
        
        // text: req.body.text,

    });
    // console.log(json(list));
    res.status(200).json(list)
})


const updateList = asyncHandler (async (req, res) => {
    // const list = await List.findById(req.body.listId);
    const tickerName = res.body.tickerName;
    console.log(`listController addTicker: ${res.body.listId}  | ${res.body.tickerName}`)

    if(!req.body.listId) {
        res.status(400);
        throw new Error('List not found');
    }

    // if (!req.user) {
    //     res.status(401);
    //     throw new Error('User not found');
    // }
    // if(list.user.toString() !== req.user.id) {
    //     res.status(401);
    //     throw new Error('User not authorized');
    // }

    const updateList = await List.findByIdAndUpdate(
        req.body.listId,
        {tickerList: tickerName},
        {new: true}
    )
        
    
    res.status(200).json(updateList)
})

// @desc Delete lists
// @route DELETE /api/lists
// @access Private
const deleteList = asyncHandler (async (req, res) => {
    const list = await List.findById(req.params.id);
    if(!list) {
        res.status(400);
        throw new Error('List not found');
    }

    if(!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    if(list.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized')
    }

    await list.remove();
    res.status(200).json({ id: req.params.id})
})

// @desc Put lists
// @route PUT /api/lists
// @access Private
const addTicker = asyncHandler (async (req, res) => {
    // const list = await List.findById(req.body.listId);
    const tickerName = req.body.tickerName;
    console.log(`listController addTicker: ${req.body.listId}  | ${req.body.tickerName}`)

    if(!req.body.listId) {
        res.status(400);
        throw new Error('List not found');
    }

    // if (!req.user) {
    //     res.status(401);
    //     throw new Error('User not found');
    // }
    // if(list.user.toString() !== req.user.id) {
    //     res.status(401);
    //     throw new Error('User not authorized');
    // }

    const updateList = await List.findByIdAndUpdate(
        req.body.listId,
        {$push:{            
            tickerList: tickerName
        }}
    )
        
    
    res.status(200).json(updateList)
})

const deleteTicker = asyncHandler (async (req, res) => {
    // const list = await List.findById(req.body.listId);
    const tickerName = res.body.tickerName;
    console.log(`listController deleteTicker: ${res.body.listId}  | ${res.body.tickerName}`)

    if(!req.body.listId) {
        res.status(400);
        throw new Error('List not found');
    }

    // if (!req.user) {
    //     res.status(401);
    //     throw new Error('User not found');
    // }
    // if(list.user.toString() !== req.user.id) {
    //     res.status(401);
    //     throw new Error('User not authorized');
    // }

    const updateList = await List.findByIdAndUpdate(
        req.body.listId,
        {tickerList: tickerName},
        {new: true}
    )
        
    
    res.status(200).json(updateList)
})



module.exports = {
    getLists,
    setList,
    updateList,
    deleteList,
    addTicker,
    deleteTicker
}