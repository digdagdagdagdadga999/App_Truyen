const user = require("../models/UserModel");
const { generateToken, auth } = require("../middleware/jwwt");


//hiển thị trang chủ
exports.trangchu = (req, res) => {
    user.find()
        .then(() => {
            res.render("users/index", { layout: "layouts/main" })
        })
        .catch((err) => {
            console.error("Lỗi: ", err);
            res.status(500).send("Lỗi 500");
        })
}

// hiển thị quản lý người dùng
exports.getUser = (req, res) => {
    user.find()
        .then((users) => {
            res.render("users/UserManger", { users, layout: "layouts/main" });
        })
        .catch((err) => {
            console.error("Lỗi");
        })
}


// hiển thị trang đăng nhập
exports.getDangNhap = (req, res) => {
    res.render("users/DangNhap", { layout: "layouts/main" });
}

// hiển thị trang đăng ký
exports.getDangKy = (req, res) => {
    res.render("users/DangKy", { layout: "layouts/main" });
}

// tạo đăng ký
exports.postDangKy = (req, res) => {
    const newUser = new user({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        fullname: req.body.fullname,
    });
    newUser
        .save()
        .then(() => {
            res.redirect("/dangnhap");
        })
        .catch((err) => {
            console.error("Lỗi: ", err);
            res.status(500).send("Đăng ký không thành công. Vui lòng thử lại sau");
        })
}

// tạo đăng nhập
exports.postDangNhap = (req, res) => {
    const { username, password } = req.body;
    user.findOne({ username })
        .then((users) => {
            if (!users) {
                return res
                    .status(501)
                    .send("không tìm thấy người dùng với username " + users.username);
            } else {
                if (password == users.password) {
                    const token = generateToken(users);
                    res.cookie("users", token, {
                        httpOnly: true,
                        sameSite: "Strict",
                        maxAge: 1000 * 60 * 60 * 24,
                    });
                    res.redirect("/"); // Redirect to homepage after successful login
                } else {
                    res.status(500).send("Mật khẩu không chính xác");
                }
            }
        })
        .catch((err) => {
            console.error("Lỗi: ", err);
            res.status(500).send("Lỗi server");
        });
};

// hiển thị trang update
exports.getEditUser = (req, res) => {
    const userId = req.params.id;
    user.findById(userId)
        .then((users) => {
            res.render("users/EditUser", { users, layout: "layouts/main" });
        })
        .catch((err) => {
            console.error("Lỗi");;
        })
}

// xử lý cập nhật
exports.postEditUser = (req, res) => {
    const userId = req.params.id;
    const updateUser = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        fullname: req.body.fullname,
    };

    user.findByIdAndUpdate(userId, updateUser)
        .then(() => {
            res.redirect("/getuser");
        })
        .catch((err) => {
            console.error("Lỗi", err);
        })
};

// xóa user
exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    user.findByIdAndDelete(userId)
        .then(() => {
            res.redirect("/getuser");
        })
        .catch((err) => {
            console.error("Lỗi", err);
        })
}