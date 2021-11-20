
const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true,
    } ,
    image: {
        type:String,
        default:'',
    },
    price:{
        type:String,
        default:0,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        require:true,
    },
    countInStock: {
        type: Number,
        required: true,
        min:0,
        max:225,
    },
    dateCreated:{
        type: Date,
        default: Date.now,

    },
})
exports.product = mongoose.model('Product', ProductSchema);


// const Product = mongoose.model('Product', productSchema);
// module.exports={Product};