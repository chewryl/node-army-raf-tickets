const express = require('express');

const cartController = require('../controllers/cart');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/cart', isAuth, cartController.getCart);

router.post('/cart', isAuth, cartController.postCart);

/* router.post('/cart-details', isAuth, cartController.postCartDetails); */

router.get('/cart/checkout', isAuth, cartController.getCheckout);
router.post('/cart/checkout', isAuth, cartController.postCheckout);

router.get('/checkout/success', isAuth, cartController.getCheckoutSuccess);

router.get('/checkout/cancel', isAuth, cartController.getCheckout); // will get this route again if stripe payment fails 



module.exports = router;