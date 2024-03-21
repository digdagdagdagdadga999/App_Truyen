const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;


const generateToken = (users) => {
    const payload = {
        id: users.id,
        email: users.email,
        username: users.username,
    };
    const token = jwt.sign(payload, jwtSecret, {
        expiresIn: "1h",
    });
    return token;
};

const auth = (req, res, next) => {
    const userCookie = req.cookies["user"];

    if (!userCookie) {
        return res
            .status(401)
            .json("Bạn cần đăng nhập để thực hiện chức năng này!");
    }

    try {
        const decoded = jwt.verify(userCookie, jwtSecret);
        req.user = decoded; // Lưu thông tin người dùng vào req
        next();
    } catch (error) {
        return res.status(401).json("Token không hợp lệ!");
    }
};



module.exports = { generateToken, auth };
