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
exports.getUser = async (req, res) => {
    try {
        let list = await user.find({});
        res.json(list);
    } catch (error) {
        res.json({ status: "Not found", result: error });
    }
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
            // res.redirect("/dangnhap");
            res.json({ message: "Đăng ký thành công" });
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
                    .status(404)
                    .send("không tìm thấy người dùng với username " + users.username);
            } else {
                if (password == users.password) {
                    const token = generateToken(users);
                    res.cookie("users", token, {
                        httpOnly: true,
                        sameSite: "Strict",
                        maxAge: 1000 * 60 * 60 * 24,
                    });
                    // res.redirect("/");
                    res.json(users);
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
        email: req.body.email,
        password: req.body.password,
        fullname: req.body.fullname,
    };

    user.findByIdAndUpdate(userId, updateUser, { new: true })
        .then(() => {
            // res.redirect("/getuser");
            res.json({ message: "Cập nhật người dùng thành công" });
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
            // res.redirect("/getuser");
            res.json({ message: "Xóa người dùng thành công" });
        })
        .catch((err) => {
            console.error("Lỗi", err);
        })
}

// get user id
exports.getUserById = async (req, res, next) => {
    try {
        let id = req.params.id;

        console.log("Received ID:", id); // Log ID để kiểm tra

        let obj = await user.findById(id);
        console.log("User Object:", obj); // Log đối tượng user để kiểm tra

        if (!obj) {
            console.log("User not found with ID:", id); // Log thông báo khi không tìm thấy user
            return res.json({ status: "not found", message: "User not found with ID" });
        }

        res.json(obj);

    } catch (error) {
        console.error("Error:", error); // Log lỗi nếu có
        res.json({ status: "error", result: error });
    }
}

exports.logOut = (req, res) => {
    try {
        res.cookie("users", "", { maxAge: 1 });
        res.clearCookie("users");
        // res.redirect("/getFormLogin");
        res.json({ message: "Đăng xuất thành công" });
    } catch (error) {
        res.status(500).json({ error: "Có lỗi xảy ra: " + error.message });
    }
}