const express = require('express');

const ticketController = require('../controllers/tickets');

const router = express.Router();

router.get('/', ticketController.getIndex);

router.post('/', ticketController.postItem);

router.post('/delete-item', ticketController.postDeleteItem);


module.exports = router;