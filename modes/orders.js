const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
orderIterms:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'OrderIterm',
    required:true
}],
shippingAddress1:{
    type: String,
    required:true,
},
shippingAddress2:{
    type:String,
},
city:{
    type:String,
    required:true,

},
zip:{
    type:String,
    required:true,

},
country:{
    type:String,
    required:true,
},
phone1:{
    type:String,
    required:true,
},
phone2:{
    type:String,
},
status:{
    type:String,
    required:true,
    default:'Pending',
},
totalPrice:{
    type:Number,
},
profile:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Profile',
},
dateOrdered:{
    type: Date,
    default: Date.now,
},
user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    require: true,
},


},{
    strictPopulate: false,
});


orderSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
orderSchema.set("toJSON", { virtuals: true });



exports.Order = mongoose.model('Order',orderSchema);