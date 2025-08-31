const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");

const { connectDB } = require("../src/config/database");
const authRoutes = require("../src/routes/auth-routes");
const userRoutes = require("../src/routes/user-routes");
const connectionRequestRoutes = require("../src/routes/connection-request-routes");

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/requests", connectionRequestRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    })
});

app.use((err, req, res, next) => {
    // console.log(err.message, err.status);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
});

connectDB()
    .then(() => {
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    }).catch(err => {
        console.log("Error connecting to database: ", err);
    });