const Ticket = require('../models/ticket');


exports.getIndex = (req, res, next) => {  
    let normMessage = req.flash('normMessage');
    if (normMessage.length > 0) {
        normMessage = normMessage[0];
    } else { 
        normMessage = null;
    }

    let total;
    if (!req.session.cart || req.session.cart.length < 0) {
        total = '0.00';
    } else {
        total = calculateTotal(req.session.cart);
    }
    req.session.total = total;
    
    res.render('tickets/index', {
        items: req.session.cart || [],
        total: req.session.total,
        normMessage: normMessage
    });
};

exports.postItem = (req, res, next) => {
    const reqObj = JSON.parse(JSON.stringify(req.body)); 
    // req.body is format like { qty: '1', itemId: '4' }
    
    Ticket.fetchOne(req.body.itemId)
        .then(([ticket]) => {
            ticket[0].qty = req.body.qty;
            // Create session
            if (!req.session.cart) {
                req.session.cart = [];
            }
            const formattedTicket = JSON.parse(JSON.stringify(ticket[0]));
            let matchingItem;
            let total;
            
            if (req.session.cart.length > 0) {  
                req.session.cart.forEach(item => {
                    if (item.id === +req.body.itemId) {
                        matchingItem = item;
                        item.qty = (+item.qty + +req.body.qty);
                    } 
                });
                if (!matchingItem) {
                    req.session.cart.push(formattedTicket);
                }
                total = calculateTotal(req.session.cart);
                req.session.total = total;
                return res.render('tickets/index', {
                    items: req.session.cart || [],
                    total: req.session.total,
                    normMessage: null
                });
            }
            req.session.cart.push(formattedTicket); // case where adding to session cart for first time
            // Calculate total 
            total = calculateTotal(req.session.cart);
            req.session.total = total;

            //req.session.destroy();
            res.render('tickets/index', {
                items: req.session.cart || [],
                total: req.session.total,
                normMessage: null
            });
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;  
            return next(error); 
        })
};

exports.postDeleteItem = (req, res, next) => {
    // req.body format is like { id: 1 } so red.body.id = 1
    const id = req.body.id;
    if (req.session.cart) {
        const itemIndex= req.session.cart.findIndex(curr => curr.id === id);
        //console.log(itemIndex, 'item index...');
        req.session.cart.splice(itemIndex, 1);
        // Calculate total 
        const total = calculateTotal(req.session.cart);
        req.session.total = total;
        

        return res.render('tickets/index', {
            items: req.session.cart || [],
            total: req.session.total,
            normMessage: null
        });
    }
};



function calculateTotal(arr) {
    let total = 0.00;
    let itemTotal;
    let itemTotals = [];
    if (arr.length < 0 || !arr) {
        total = 0.00;
    }

    arr.forEach(curr => {
        if (typeof curr.qty !== "number") {
            curr.qty = +curr.qty;
        }
        if (typeof curr.price !== "number") {
            curr.price = +curr.price;
        }
        itemTotal = (curr.qty * curr.price)
        itemTotals.push(itemTotal);
    });
    //console.log(itemTotals, 'itemTotals array');

    if (itemTotals.length > 0) {
        total = itemTotals.reduce((total, curr) => total + curr);
        
    }
    //console.log(total);
    return total.toFixed(2); 
}

