const express = require('express')
const router = express.Router()
const { getLists, setList, updateList, deleteList, addTicker, deleteTicker} = require('../controllers/listController')

const {protect} = require('../middleware/authMiddleware');

router.route('/').get(protect, getLists).post(protect, setList)
router.route('/:id').put(protect, addTicker).delete(protect, deleteList)
router.route('/:id/:listId').put(protect, addTicker).delete(protect, deleteTicker)

module.exports = router;