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
    // const temp = req.body.listName
    console.log(req.body)
    // const { listName} = req.body
    console.log(`setList ${req.body.listName}`)
    console.log(`setList ${req.params.user}`)
    
    // const userExists = await User.findOne(req.user.id)
    // const listExists = await List.findOne(listName)

    // if(userExists && listExists) {
    //     throw new Error('The list already exists!')
    // }

    // if (!req.body.listName) {
    //     res.status(400);
    //     throw new Error('Please add a listname');
    // }  
    // console.log('setList')
    const list = () => {
        List.create(
        {
            
                user: req.params.user,
                listName: req.body.listName
            
        },
        (err, result) => {
            if(err) {
                console.error("Cannot update list", err);
                res.status(500).end();
            }
            else {
                res.status(200).json(result)
            }            
        }
    );
}
    // console.log(json(list));
    // res.status(200).json(list)
    list()
})
// const setList = asyncHandler (async (req, res) => {
//     console.log('Posting List');
//     const { listName } = req.body
//     // const { listName} = req.body
//     console.log(`setList ${req.body.listName}`)
//     console.log(`setList ${req.user.id}`)
    
//     // const userExists = await User.findOne(req.user.id)
//     // const listExists = await List.findOne(listName)

//     // if(userExists && listExists) {
//     //     throw new Error('The list already exists!')
//     // }

//     if (!req.body.listName) {
//         res.status(400);
//         throw new Error('Please add a listname');
//     }  
//     // console.log('setList')
//     const list = await List.create({
//         user: req.user.id,
//         listName: listName,
        
//         // text: req.body.text,

//     });
//     // console.log(json(list));
//     res.status(200).json(list)
// })


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
        { _id: req.body.listId},
        { $push: {tickerList: tickerName}},
        {new: true}
    )
        
    
    res.status(200).json(updateList)
})

// @desc Delete lists
// @route DELETE /api/lists
// @access Private
const deleteList = asyncHandler (async (req, res) => {
    console.log(req.params.listId)
    const list = await List.findById(req.params.listId);
    // if(!list) {
    //     res.status(400);
    //     throw new Error('List not found');
    // }

    // if(!req.user) {
    //     res.status(401)
    //     throw new Error('User not found')
    // }

    // if(list.user.toString() !== req.user.id){
    //     res.status(401)
    //     throw new Error('User not authorized')
    // }

    list.remove();
    res.status(200).json(list)
})

// @desc Put lists
// @route PUT /api/lists
// @access Private
const addTicker = asyncHandler (async (req, res) => {
    // const list = await List.findById(req.body.listId);
    console.log("addTicker")
    console.log(req.params)
    console.log(req.body)
    // console.log(req.body.listName)
    // const lists = await List.find({user: req.user.id, listName: req.params.listName})
    // const list = await List.find({_id: req.params.listId})
    // console.log(list)

    const tickerName = req.body.tickerName;
    console.log(tickerName)

    const list = List.findOneAndUpdate(
        {user: req.user.id, listName: req.params.listName},
        {
            $addToSet:{
                tickerList: tickerName
            }
        },
        { new: true},
        // (err, result) => {
        //     if (err) {
        //         console.error("Cannot update list", err);
        //         res.status(500).end();
        //     } 
        //     else {
        //         res.status(200).json(result)
        //         // return result
        //         console.log(result)
        //     }
        //     // console.log(result)
        // }
    )
    // const updatedList =  List.findOne({user: req.user.id, listName: req.params.listName})


    // console.log(list)
    // console.log('new List Data')
    

    return list
        
    
    // res.status(200).json(updateTickerList)
})

const deleteTicker = asyncHandler (async (req, res) => {
    // const list = await List.findById(req.body.listId);

    // console.log(req.params)
    // console.log(req.body)

    // const tickerName = res.body.tickerName;
    // console.log(`listController deleteTicker: ${res.body.listId}  | ${res.body.tickerName}`)
    console.log("deleteTicker")
    console.log(req.params)
    console.log(req.body)
    // const list = await List.find({_id: req.params.listId})
    // console.log(list)

    const tickerName = req.body.tickerName;
    console.log("tickerName")
    console.log(req.body.tickerName)

    // if(!req.body.listId) {
    //     res.status(400);
    //     throw new Error('List not found');
    // }

    // if (!req.user) {
    //     res.status(401);
    //     throw new Error('User not found');
    // }
    // if(list.user.toString() !== req.user.id) {
    //     res.status(401);
    //     throw new Error('User not authorized');
    // }

    const updateTickerList = () => {
        List.findByIdAndUpdate(
            req.params.listId,
            {
                $pull: {
                    tickerList: tickerName
                }
            },
            { new: true},
            (err, result) => {
                if(err) {
                    console.error("Cannot update llist", err);
                    res.status(500).end();
                }
                else {
                    res.status(200).json(result)
                }
            }
        )
    }

    updateTickerList();

    // const updateList = await List.findByIdAndUpdate(
    //     req.body.listId,
    //     {tickerList: tickerName},
    //     {new: true}
    // )
        
    
    // res.status(200).json(updateList)
})



module.exports = {
    getLists,
    setList,
    updateList,
    deleteList,
    addTicker,
    deleteTicker
}