const mongoose = require("mongoose");

const TruyenTranhSchema = new mongoose.Schema({
    ten_truyen: { type: String, required: true },
    mo_ta: { type: String },
    tac_gia: { type: String },
    nam_xb: { type: String },
    anh_bia: { type: String },
    noi_dung_anh_truyen: [{ type: String }],
    binh_luan: [{
        content: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        username: { type: mongoose.Schema.Types.String, ref: "user", required: true },
        time: { type: Date, default: Date.now },
    }],
});

const truyenTranh = mongoose.model("tb_truyen", TruyenTranhSchema);

module.exports = truyenTranh;