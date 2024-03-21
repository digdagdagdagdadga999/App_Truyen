const truyen = require("../models/TruyenTranhModel");
const isEmpty = require("lodash/isEmpty");

// hiển thị danh sách truyện
exports.getAllTruyen = (req, res) => {
    truyen.find()
        .then((truyens) => {
            res.render("truyen/DanhSachTruyen", { truyens, layout: "layouts/main" });
        })
        .catch((err) => {
            res.status(500).send("Lỗi");
        });
}

exports.getChiTiet = (req, res) => {
    const idTruyen = req.params.id;
    truyen.findById(idTruyen)
        .then((truyens) => {
            if (!truyens) {
                // Nếu không tìm thấy truyện, có thể xử lý thông báo lỗi hoặc chuyển hướng đến trang khác
                return res.status(404).send("Không tìm thấy truyện");
            }
            res.render("truyen/ChiTietTruyen", { truyens, layout: "layouts/main" });
        })
        .catch((err) => {
            res.status(500).send("Lỗi");
        });
}

// hiển thị form add
exports.getAddTruyen = (req, res) => {
    res.render("truyen/AddTruyen", { layout: "layouts/main" });
}

// xử lý thêm truyện
exports.postAddTruyen = (req, res) => {
    console.log(req.body);
    const newTruyen = new truyen({
        ten_truyen: req.body.ten_truyen,
        mo_ta: req.body.mo_ta,
        tac_gia: req.body.tac_gia,
        nam_xb: req.body.nam_xb,
        anh_bia: req.files.anh_bia ? req.files.anh_bia[0].path : "",
        noi_dung_anh_truyen: req.files.noi_dung_anh_truyen?.map((file) => file.path) || [],
    });
    newTruyen
        .save()
        .then(() => {
            res.redirect("/");
        })
        .catch((err) => {
            res.status(500).send("Lỗi");
        })
}

// hiển thị form update
exports.getUpdateTruyen = (req, res) => {
    const idTruyen = req.params.id;
    truyen.findById(idTruyen)
        .then((truyens) => {
            res.render("truyen/EditTruyen", { truyens, layout: "layouts/main" });
        })
        .catch((err) => {
            res.status(500).send("Lỗi");
        });
};

// xử lý thông tin update
exports.postUpdateTruyen = (req, res) => {
    const idTruyen = req.params.id;
    const hasAnhBia = req.files && req.files.anh_bia && req.files.anh_bia.length > 0;
    const hasNoiDungAnhTruyen = req.files && req.files.noi_dung_anh_truyen && req.files.noi_dung_anh_truyen.length > 0;

    const updateTruyen = {
        ten_truyen: req.body.ten_truyen,
        mo_ta: req.body.mo_ta,
        tac_gia: req.body.tac_gia,
        nam_xb: req.body.nam_xb,
    };

    if (hasAnhBia) {
        updateTruyen.anh_bia = req.files.anh_bia[0].path;
    }

    if (hasNoiDungAnhTruyen) {
        updateTruyen.noi_dung_anh_truyen = req.files.noi_dung_anh_truyen.map((file) => file.path);
    }

    truyen.findByIdAndUpdate(idTruyen, updateTruyen)
        .then(() => {
            res.redirect("/alltruyen");
        })
        .catch((err) => {
            res.status(500).send("Lỗi cập nhật truyện");
        });
};

// xử lý chức năng xóa
exports.deleteTruyen = (req, res) => {
    const idTruyen = req.params.id;
    truyen.findByIdAndDelete(idTruyen)
        .then(() => {
            res.redirect("/alltruyen");
        })
        .catch((err) => {
            res.status(500).send("Lỗi khi xóa truyện");
        });
};

// xử lý chức năng thêm bình luận
exports.postConment = async (req, res) => {

    const idTruyen = req.params.id;
    const userId = req.user?._id || null;  // Use optional chaining
    const username = req.user?.username || null;  // Use optional chaining
    const content = req.body.content;

    if (!userId || !username) {
        return res.redirect('/dangnhap');  // Redirect to login if not authenticated
    }

    const newComment = {
        content,
        userId,
        username,
        time: Date.now(),
    };
    console.log("/////////////////");
    console.log(newComment);

    truyen.findByIdAndUpdate(idTruyen, { $push: { binh_luan: newComment } })
        .then(() => {
            res.redirect(`/chiTietTruyen/${idTruyen}`);
        })
        .catch((err) => {
            console.error("Error updating truyện:", err.message);
            res.status(500).send("Lỗi thêm bình luận: " + err.message);
        })
}