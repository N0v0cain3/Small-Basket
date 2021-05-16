const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors")
const productRoutes = require("./api/controllers/product")
const adminRoutes = require("./api/controllers/admin")
const cartRoutes = require("./api/controllers/cart")
const customerRoutes = require("./api/controllers/customer")
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, auth-token, On-behalf-of, x-sg-elas-acl"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use(cors());
app.use("/customer", customerRoutes);
app.use("/products", productRoutes);
app.use("/admin", adminRoutes)
app.use("/cart", cartRoutes)

app.use((req, res, next) => {
    console.log(req.url)
    const error = new Error("Route not found");
    error.status = 404;
    next(error);
});





var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "smallbasket",
    port: "3506"
});



console.log("Connected!");
var sql = "select * from customer;";
con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);

});

const PORT = process.env.PORT || 3000;

//Start the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});