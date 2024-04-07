const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null , uniqueSuffix + file.originalname);
    }
});

const upload = multer({ storage: storage });

const cpAvatarUpload = upload.single('Avatar')

const cpUpload = upload.fields([
    { name: 'anh_bia', maxCount: 1 },
    { name: 'noi_dung_anh_truyen', maxCount: 100 }
  
]);

module.exports = {
    cpUpload,
    cpAvatarUpload,
    storage
};