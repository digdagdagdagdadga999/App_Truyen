const truyen = require("../models/TruyenTranhModel");
const isEmpty = require("lodash/isEmpty");

// hiển thị danh sách truyện
exports.getAllTruyen = async (req, res) => {
  try {
    let list = await truyen.find({});
    res.json(list);
  } catch (error) {
    res.json({ status: "Not found", result: error });
  }
}

exports.getChiTiet = (req, res) => {
  const idTruyen = req.params.id;
  truyen
    .findById(idTruyen)
    .then((truyens) => {
      if (!truyens) {
        // Nếu không tìm thấy truyện, có thể xử lý thông báo lỗi hoặc chuyển hướng đến trang khác
        return res.status(404).send("Không tìm thấy truyện");
      }
      res.status(200).json({ truyens, binh_luan: truyens.binh_luan });
    })
    .catch((err) => {
      res.status(500).send("Lỗi");
    });
};

// hiển thị form add
exports.getAddTruyen = (req, res) => {
  res.render("truyen/AddTruyen", { layout: "layouts/main" });
};

// xử lý thêm truyện
exports.postAddTruyen = (req, res) => {
  
  const newTruyen = new truyen({
    ten_truyen: req.body.ten_truyen,
    mo_ta: req.body.mo_ta,
    tac_gia: req.body.tac_gia,
    nam_xb: req.body.nam_xb,
    anh_bia: req.files.anh_bia ? req.files.anh_bia[0].filename : null,
    noi_dung_anh_truyen:
      req.files.noi_dung_anh_truyen?.map((file) => file.path) || [],
  });
  console.log(newTruyen);

  newTruyen
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      res.status(500).send("Lỗi");
    });
};

// hiển thị form update
exports.getUpdateTruyen = (req, res) => {
  const idTruyen = req.params.id;
  truyen
    .findById(idTruyen)
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
  const hasAnhBia =
    req.files && req.files.anh_bia && req.files.anh_bia.length > 0;
  const hasNoiDungAnhTruyen =
    req.files &&
    req.files.noi_dung_anh_truyen &&
    req.files.noi_dung_anh_truyen.length > 0;

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
    updateTruyen.noi_dung_anh_truyen = req.files.noi_dung_anh_truyen.map(
      (file) => file.path
    );
  }

  truyen
    .findByIdAndUpdate(idTruyen, updateTruyen)
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
  truyen
    .findByIdAndDelete(idTruyen)
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
  const userId = req.users.id;
  const username = req.users.username;
  const content = req.body.content;

  if (!userId || !username) {
    return res
      .status(401)
      .send("Bạn cần đăng nhập để thực hiện chức năng này!");
  }

  const newComment = {
    content,
    userId,
    username,
    time: Date.now(),
  };

  truyen
    .findByIdAndUpdate(idTruyen, { $push: { binh_luan: newComment } })
    .then((truyens) => {
      res.redirect(`/chiTietTruyen/${idTruyen}`);
    })
    .catch((err) => {
      console.error("Error updating truyện:", err.message);
      res.status(500).send("Lỗi thêm bình luận: " + err.message);
    });
};


exports.doctruyen = (req, res) => {
  const idTruyen = req.params.id;
  truyen
    .findById(idTruyen)
    .then((truyens) => {
      if (!truyens) {
        // Nếu không tìm thấy truyện, có thể xử lý thông báo lỗi hoặc chuyển hướng đến trang khác
        return res.status(404).send("Không tìm thấy truyện");
      }
      res.render("truyen/DocTruyen", {
        truyens,
        layout: "layouts/main",
      });
    })
    .catch((err) => {
      res.status(500).send("Lỗi");
    });
};

// exports.deleteTruyen = async (req, res) => {
//   const truyenId = req.params.truyensId;
//   const binh_luan_id = req.params.binh_luanId;

//   console.log(truyenId);
//   console.log(binh_luan_id);

//   truyen.findByIdAndDelete(truyenId, { $pull: { binh_luan: { _id: binh_luan_id } } })
//     .then((truyens) => {
//       res.redirect(`/chiTietTruyen/${truyenId}`);
//     })
//     .catch((err) => {
//       console.error("Error updating truyện:", err.message);
//       res.status(500).send("Lỗi thêm bình luận: " + err.message);
//     });
// }