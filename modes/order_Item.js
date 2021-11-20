const mongoose = require('mongoose');
const orderItemsSchema = mongoose.Schema({
product:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Product'
},
quatity:{
    type: Number,
    required:true,
}},
{
    strictPopulate: false,
}
);

orderItemsSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
orderItemsSchema.set("toJSON", { virtuals: true });


exports.OderIterm = mongoose.model('OrderIterm',orderItemsSchema);