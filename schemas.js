const BaseJoi = require('joi');
const sanitizeHTML = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers){
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });

                if(clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.productSchema = Joi.object({
    product: Joi.object({
        name: Joi.string().required().allow('').escapeHTML(),
        price: Joi.number().required().min(0),
        description: Joi.string().allow('').escapeHTML()
    }),
    deleteImages: Joi.array()
});

module.exports.costTypeSchema = Joi.object({
    cost_type: Joi.object({
        name: Joi.string().required().escapeHTML(),
        type: Joi.string().required().valid('cost', 'profit')
    })
})

module.exports.paymentSchema = Joi.object({
    payment: Joi.object({
        order_id: Joi.string().required(),
        payment_category: Joi.string().required().valid('DP', 'Installment', 'Paid Off'),
        payment_code: Joi.string().required(),
        payment_value: Joi.number().required().min(0),
        payment_date: Joi.string()
    })
})

module.exports.rootIngridientSchema = Joi.object({
    ingridient: Joi.object({
        name: Joi.string().required().escapeHTML(),
        qty: Joi.number().required().min(0),
        price: Joi.number().required().min(0),
        unit: Joi.string().required().escapeHTML(),
        total: Joi.number().required().min(0)
    })
})

module.exports.orderSchema = Joi.object({
    order: Joi.object({
        order_for: Joi.string().required().escapeHTML(),
        order_code: Joi.string().required().escapeHTML(),
        total_order: Joi.number().required().min(0),
        order_address: Joi.string().required().escapeHTML(),
        order_date: Joi.string().required(),
        date_taken: Joi.string().required(),
        order_category: Joi.string().required().valid('pickup', 'delivery')
    })
})