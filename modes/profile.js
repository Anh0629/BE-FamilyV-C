const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: "",
  },

  phone: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    street: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    state: { type: String, required: true },
  },
});

profileSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

profileSchema.set("toJSON", { virtuals: true });

exports.Profile = mongoose.model("Profile", profileSchema);
