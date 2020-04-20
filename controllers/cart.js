const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const db = require('../util/database');
const Order = require('../models/order');
const OrderItem = require('../models/order-item');
const Address = require('../models/address')

exports.getCart = (req, res, next) => {

    res.render('cart/cart', {
        items: req.session.cart || [],
        total: req.session.total || 0.00
    });
};

exports.postCart = (req, res, next) => {
    console.log(req.session.user);
    console.log(req.session.cart);
    res.render('cart/cart', {
        items: req.session.cart,
        total: req.session.total
    });
};


// normal get request to /cart/checkout - incase user goes back a page from checkout etc. 
exports.getCheckout = (req, res, next) => { // get here from post request to /cart/checkout
    stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: req.session.cart.map(p => {
          return {
            name: p.tier,
            amount: parseInt(p.price * 100),  // * 100 because we need to specify this in pence -- n/a anymore...
            currency: 'gbp',
            quantity: p.qty
          }; 
        }),
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success',  // => http://localhost:3000/checkout/success
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
      })
      .then(session => {
          console.log(session);
          res.render('cart/checkout', {
              items: req.session.cart,
              total: req.session.total,
              address: req.session.addressArr,
              sessionId: session.id
          });
      })
      .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;  
        return next(error); 
      });
};


exports.postCheckout = (req, res, next) => { // get here from post request to /cart/checkout
    let addressArr = [];

    const address1 = req.body.address1;
    const address2 = req.body.address2;
    const townCity = req.body.townCity;
    const county = req.body.county;
    const postalCode = req.body.postalCode;

    addressArr.push(address1, address2, townCity, county, postalCode);
    req.session.addressArr = addressArr;

    stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: req.session.cart.map(p => {
          return {
            name: p.tier,
            amount: parseInt(p.price * 100),  // * 100 because we need to specify this in pence -- n/a anymore...
            currency: 'gbp',
            quantity: p.qty
          }; 
        }),
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success',  // => http://localhost:3000/checkout/success
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
      })
      .then(session => {
          //console.log(session);
          res.render('cart/checkout', {
              items: req.session.cart,
              total: req.session.total,
              address: req.session.addressArr,
              sessionId: session.id
          });
      })
      .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;  
        return next(error); 
      });
};

 
exports.getCheckoutSuccess = (req, res, next) => {
    // save address in db
    const [address1, address2, townCity, county, postalCode] = req.session.addressArr;   
    const address = new Address(null, address1, address2, townCity, county, postalCode);
    
    db.query('INSERT INTO addresses SET ?', { address1: address1, address2: address2, townCity:townCity, county: county, postalCode: postalCode})
    .then(([res]) => {
        console.log(res.insertId);
        // save order in db
        return db.query('INSERT INTO orders SET ?', {userId: req.session.user.id, addressId: res.insertId})
    })
    .then(([res]) => {
        // save orderItems in db
        req.session.cart.forEach(item => {
            db.query('INSERT INTO orderItems SET ?', {quantity: item.qty, orderId: res.insertId, ticketId: item.id })
        })
    })
    .then(() => {
        req.session.cart = [];
        req.flash('normMessage', 'You have been sent a confirmation email of your order.');
        res.redirect('/');
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;  
        return next(error); 
    });

};





