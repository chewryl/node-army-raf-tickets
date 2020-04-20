const User = require('../models/user');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const crypto = require('crypto');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        pageTitle: 'Signup',
        errorMessage: message,
        oldInput: {         // need to define oldInput because of keeping user data in postLogin()
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationErrors: []
    });
};

exports.getLogin = (req, res, next) => {
    //const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else { 
        message = null;
    }

    let normMessage = req.flash('normMessage');
    if (normMessage.length > 0) {
        normMessage = normMessage[0];
    } else { 
        normMessage = null;
    }
    res.render('auth/login', {
        pageTitle: 'Login',
        errorMessage: message,
        normMessage: normMessage,
        oldInput: {         // need to define oldInput because of keeping user data in postLogin()
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Please enter a valid email and password',
            normMessage: null,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array()
        });
    }

    User.findByEmail(email)
        .then(([user]) => {
            user = user[0];
            if (!user) {   // i.e. doesn't exist 
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }

            // Email exists, validate password
            bcrypt.compare(password, user.password)
                .then(boolean => {
                    if (boolean) { // coerces to true
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            if (err) console.log(err);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid email or password.');
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                })
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;  
            return next(error); 
        });
 }; 

exports.postSignup = (req, res, next) => {   // NEED TO VALIDATE USER INPUT
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;      
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg, // we do check('email'.withMessage("") in the routes anyway…
            oldInput: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                confirmPassword: req.body.confirmPassword
            },
            validationErrors: errors.array()
        });
    } 

    User.findByEmail(email)
        .then(([user]) => {
            user = user[0];
            if (user) { 
                req.flash('error', 'User with that email already exists.');
                return res.redirect('/signup');
            }
            // Email does not already exist - create user
            bcrypt.hash(password,12)
                .then(hashedPassword => {
                    const newUser = new User(null, firstName, lastName, email, hashedPassword);
                    return newUser.save()
                })
                .then(() => {
                    req.flash('normMessage', 'Account successfully created!');
                    res.redirect('/login')
                })
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;  
            return next(error); 
        })
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/'); 
    });
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        errorMessage: message
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            req.flash('error', 'There was a problem with resetting your password. Please ensure you enter the correct email address.');
            console.log(err);
            return res.redirect('/reset');
        }
        // We have valid buffer
        const token = buffer.toString('hex');

        // Find user that we want to reset password for
        User.findByEmail(req.body.email)
            .then(([user]) => {
                user = user[0];
                if(!user) {
                    req.flash('error', 'No account with that email found.');
                    return res.redirect('/reset');
                }
                 // User found - reset the resetToken field of the user
                const resetToken = token;
               // const d = Date.now() + 36000000;  // Exp = 1hr
                const resetTokenExpiration = new Date(Date.now() + 36000000);
                console.log(resetTokenExpiration);
                return User.setToken(resetToken, resetTokenExpiration, req.body.email);
            })
            .then(result => {
                req.flash('normMessage', 'You have been sent an email with a link to reset your password.');
                res.redirect('/login');
                // Send the token reset email to the user
                transporter.sendMail({
                    to: req.body.email,
                    from: 'tickets@avr-tickets.com',
                    subject: 'Reset Password',
                    html: `
                    <p>You requested a password reset.</p>
                    <p>Click <a href="http://localhost:4000/reset/${token}">here</a> to set a new password.</p>
                    <p>Please note that this link is only valid for one hour.</p>
                    `
                });
            })
            .catch(err => {
                console.log(err);
                const error = new Error(err);
                error.httpStatusCode = 500;  
                return next(error); 
            })
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findbyResetToken(token)
    .then(([user]) => {
        user = user[0];
        let message = req.flash('error');
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }
        res.render('auth/new-password', {
            errorMessage: message,
            userId: user.id,
            passwordToken: token
        });
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;  
        return next(error); 
    })
 };

 exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
  
    // Reset the User
    bcrypt.hash(newPassword, 12)
    .then(hashedNewPassword => {
        return User.saveNewPassword(hashedNewPassword, null, null, userId)
    })
    .then(result => {
        req.flash('normMessage', 'Your Password has successfully been changed.');
        res.redirect('/login');
        // Send mail/UI message confirming the reset?
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;  
        return next(error); 
    })
 };
 
 
