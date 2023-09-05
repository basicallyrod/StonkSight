const express = require('express')
const router = express.Router()
const { getLists, setList, updateList, deleteList, addTicker, deleteTicker} = require('../controllers/listController')

const {protect} = require('../middleware/authMiddleware');

router.route('/').get(protect, getLists)
router.route('/:user').post(protect, setList)
router.route('/:user/:listId/').delete(protect, deleteList)
router.route('/:listId').put(protect, addTicker).delete(protect, deleteTicker)

module.exports = router;