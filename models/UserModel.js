const mongoose = require("mongoose");
// const validator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    email: { type: String, require: true },
    fullname: { type: String, require: true },

});

// userSchema.plugin(validator);
const user = mongoose.model("tb_users", userSchema);

// xuất model để có thể sử dụng trong các module khác của ứng dụng
module.exports = user;