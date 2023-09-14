const mongoose = require('mongoose');
const User = require('./User');

// Define schema
const productSchema = mongoose.Schema({
    owner: {
        type: 'ObjectId',
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 20
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    images: [{
        type: String,
        required: true
    }],
    description: {
        type: String,
        maxLength: 500
    }
})

/* The `productSchema.statics.getVendor` function is a static method defined on the `productSchema`
schema. It is used to retrieve the vendor associated with a product. */
productSchema.statics.getVendor = async (user) => {
    const vendor = await User.findOne({ _id: user._id, "vendor.accountType": true });
    if (vendor) {
        return vendor;
    }
    else {
        return false;
    }
}

/* The `productSchema.statics.getProduct` function is a static method defined on the `productSchema`
schema. It is used to retrieve a product based on its ID. */
productSchema.statics.getProduct = async (id) => {
    const product = await Product.findOne({ _id: id });
    if (product) {
        return product;
    }
    else {
        return false;
    }
}

// Define models based on the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
