const Product = require('../models/product');
const Order = require('../models/order');
const OrderDetail = require('../models/order_detail');


const moment = require('moment')
const title = 'Order'

module.exports.index = async (req, res) => {
    const orders = await Order.find({});
    res.render('order/index', {orders, title, moment});
}

module.exports.renderNewForm = async (req, res) => {
    const products = await Product.find({owner: req.user._id})
    const code = await generate_code('ORD');
    res.render('order/form', {products, code, title});
}

const generate_code = async (header) => {
    let new_date = new Date().toISOString().split('T');
    let time = new_date[1].replaceAll(':', '').replace('Z', '').replace('.', '');
    let date = new_date[0].replaceAll('-', '');
    date = date + time;

    return header + '-' + date;
}

module.exports.store = async(req, res, next) => {
    const order = new Order(req.body.order);
    order.owner = req.user._id;
    
    await order.save();

    await saveDetailOrder(req, order);


    req.flash('success', 'Successfully add new order');
    res.redirect(`/order/${order._id}`);
}

const saveDetailOrder = async (req, order) => {
    // const { id } = req.params;
    const id = order.id;

    let order_details = req.body.order_detail;
    console.log('order_details: ', order_details);

    await OrderDetail.deleteMany({order_id: id})
    order.order_details = [];

    if(order_details){
        if(Array.isArray(order_details.total)){
            for (let i = 0; i < order_details.total.length; i++) {
                const element = array[i];
                
                if(order_details.total[i] > 0) {
                    let temp = {
                        order_id: id,
                        product_id: order_details.product_id[i],
                        qty: order_details.qty[i],
                        price: order_details.price[i],
                        total: order_details.total[i],
                    } 

                    const detail = new OrderDetail(temp);
                    await detail.save();

                    order.order_details.push(detail);
                }
            }
        }
        else{
            if(order_details.total > 0) {
                let temp = {
                    order_id: id,
                    product_id: order_details.product_id,
                    qty: order_details.qty,
                    price: order_details.price,
                    total: order_details.total,
                } 

                const detail = new OrderDetail(temp);
                await detail.save();

                order.order_details.push(detail);
            }
        }
    }
    
    await order.save();
}


module.exports.show = async (req, res) => {
    const { id } = req.params;

    const order = await Order.findById(id)
        .populate({
            path: 'order_details',
            populate: {
                path: 'product_id'
            }
        })
        .populate('payments');

    if(!order){
        req.flash('error', 'Cannnot find that order');
        return res.redirect('/order');
    }
    res.render('order/show', { order: order, moment: moment });
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const cost_type = await Order.findById(id);

    if(!cost_type){
        req.flash('error', 'Cannnot find that cost_type');
        return res.redirect('/cost_type');
    }

    res.render('cost_type/form', { cost_type: cost_type });
}


module.exports.update = async (req, res) => {
    const { id } = req.params;
    const cost_type  = await Order.findByIdAndUpdate(id, {...req.body.cost_type});

    await cost_type.save();
    
    req.flash('success', 'Successfully updated cost type!');
    res.redirect(`/cost-type`);
}


module.exports.delete = async (req, res) => {
    const { id } = req.params;

    await Order.findByIdAndDelete(id);

    req.flash('success', 'Successfully deleted order');
    res.redirect('/order');
}
