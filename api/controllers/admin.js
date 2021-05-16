const { Router } = require("express");
const router = Router();
const mysql = require("mysql");
const uuid = require("uuid")
const { upload } = require("../middleware/s3UploadClient")
//database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "smallbasket",
  port: "3506"
});



router.get("/all", async (req, res) => {

  var sql = "select * from products;";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.status(200).json({
      result
    })
    console.log(result);
  });

})

router.post('/addProduct', upload.single("image"), async (req, res) => {
  let sql = 'INSERT INTO product SET ?'
  let post = {
    p_id: uuid.v1(),
    p_name: req.body.p_name,
    p_price: req.body.p_price,
    p_url: req.file.location,
    p_expiry: req.body.p_expiry,
    quantity: req.body.quantity
  }
  con.query(sql, post, (err, result) => {
    if (err) throw err;
    console.log('success');
    res.status(201).json({
      result
    })
    console.log(res);
  });
})

router.patch('/modify/:product_id', async (req, res) => {
  let sql = 'UPDATE product SET ? WHERE p_id = ?'
  let post = req.body;
  con.query(sql, [post, req.params.product_id], (err, result) => {
    if (err) throw err;
    console.log('success');
    res.status(201).json({
      result
    })

  });
})


module.exports = router;

