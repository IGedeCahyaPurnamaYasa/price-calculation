const Order = require('../models/order');
const Payment = require('../models/payment');

const helper = require('../helper/global_helper');
const moment = require('moment')
const title = 'Payment';

module.exports.index = async (req, res) => {
    const payments = await Payment.find({}).
        populate('order_id');
    res.render('payment/index', {payments, title, moment});
}

module.exports.renderNewForm = async (req, res) => {
    let payment = await Payment.find({
        owner: req.user._id,
        payment_category: 'Paid Off'
    }).select({'order_id': 1, '_id': 0});

    const paid_order = [];

    payment.forEach(function(row){
        paid_order.push(row.order_id.toString());
    })

    let orders = await Order.find({
        owner: req.user._id,
        _id: {
            $nin : paid_order
        }
    });

    const code = helper.generate_code('PAY');

    res.render('payment/form', {title, orders, moment, code});
}

module.exports.store = async(req, res, next) => {
    const payment = new Payment(req.body.payment);
    payment.owner = req.user._id;

    await payment.save();

    await save_order_payment(payment);


    req.flash('success', 'Successfully add new payment');
    res.redirect(`/payment`);
}

const save_order_payment = async (payment) => {
    const order = await Order.findOne({_id: payment.order_id});
    
    if(!order.payments){
        order.payments = [];
    }
    
    order.payments.push(payment);
    await order.save();
}

module.exports.show = async (req, res) => {
    const { id } = req.params;

    const payment = await Payment.findById(id)
        .populate('order_id');

    if(!payment){
        req.flash('error', 'Cannnot find that payment');
        return res.redirect('/payment');
    }
    res.render('payment/show', { payment, moment });
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const payment = await Payment.findById(id)
        .populate('order_id');

    const orders = await Order.find({owner: req.user._id});

    if(!payment){
        req.flash('error', 'Cannnot find that payment');
        return res.redirect('/payment');
    }

    res.render('payment/form', {payment, title, orders, moment});
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const payment  = await Payment.findByIdAndUpdate(id, {...req.body.payment});
    payment.owner = req.user._id;

    await payment.save();

    req.flash('success', 'Successfully updated payment!');
    res.redirect(`/payment`);
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    
    
    
    const payment = await Payment.findByIdAndDelete(id);
    await delete_order_payment(payment);


    req.flash('success', 'Successfully deleted payment');
    res.redirect('/payment');
}

const delete_order_payment = async (payment) => {
    const order = await Order.findOne({_id: payment.order_id});

    order.payments = await order.payments.filter(function(item){
        return item.toString() !== payment._id.toString()
    })
    
    order.save();
}