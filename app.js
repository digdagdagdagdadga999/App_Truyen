require('dotenv').config(); // Đặt ở đầu tệp
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/web");

const app = express();

var bodyParser = require("body-parser");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const url = "mongodb://localhost:27017";
const dbName = "db_assignment";

mongoose
    .connect(`${url}/${dbName}`)
    .then(() => {
        console.log("Kết nối thành công");
        app.listen(3000, () => {
            console.log("Server của bạn đang chạy dưới cổng 3000");
        });
    })
    .catch((err) => {
        console.error("Lỗi kết nối mongodb: ", err);
    });

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "hbs");

// Sử dụng middleware authenticateUser

app.use("/uploads", express.static("uploads"));

app.use("/", routes);