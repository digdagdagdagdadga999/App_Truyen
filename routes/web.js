const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { generateToken, auth } = require("../middleware/jwwt");
var { cpUpload, storage, cpAvatarUpload } = require("../middleware/muller");

const userController = require("../controllers/UserController");

const truyenController = require("../controllers/TruyenController");

const router = express.Router();

// hiển thị trang chủ
router.get("/", userController.trangchu);

// hiển thị trang quản lý người dùng
router.get("/getuser", userController.getUser);

// hiển thị trang đăng ký
router.get("/dangky", userController.getDangKy);

// hiển thị trang đăng nhập
router.get("/dangnhap", userController.getDangNhap);

// đăng ký
router.post("/dangky", userController.postDangKy);

// đăng nhập
router.post("/dangnhap", userController.postDangNhap);

// hiển thị trang cập nhật người dùng
router.get("/edituser/:id", userController.getEditUser);

// xử lý cập nhật người dùng
router.post("/edituser/:id", userController.postEditUser);

// xóa người dùng
router.get("/deleteUser/:id", userController.deleteUser);

router.get("/getUserById/:id", userController.getUserById);

router.get("/dangxuat", userController.logOut);


////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

// hiển thị toàn bộ danh sách truyện
router.get("/alltruyen", truyenController.getAllTruyen);

// hiển thị form thêm truyện
router.get("/addtruyen", truyenController.getAddTruyen);

// xử lý thông tin truyện
router.post("/addtruyen", cpUpload, truyenController.postAddTruyen);

//hiển thị form update truyện
router.get("/updateTruyen/:id", truyenController.getUpdateTruyen);

// xử lý thông tin update truyện
router.post("/updateTruyen/:id", cpUpload, truyenController.postUpdateTruyen);

// xử lý thông tin xóa
router.get("/deleteTruyen/:id", truyenController.deleteTruyen);

// hiển thị chi tiết
router.get("/chiTietTruyen/:id", auth, truyenController.getChiTiet);

// xử lý thông tin bình luận
router.post("/chiTietTruyen/:id/Conment", auth, truyenController.postConment);

// hiển thị đọc truyện
router.get("/chiTietTruyen/:id/doctruyen", truyenController.doctruyen);



// xuất router để sử dụng ở module khác
module.exports = router;