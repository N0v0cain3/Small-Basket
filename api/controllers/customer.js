const { Router } = require("express");
const router = Router();
const mysql = require("mysql");
const uuid = require("uuid")
//database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "smallbasket",
  port: "3506"
});



router.get("/all", async (req, res) => {

  console.log("get all products");
  var sql = "select * from customers;";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.status(200).json({
      result
    })
    console.log(result);
  });

})

router.get('/:id', async (req, res) => {
  con.query("select * from customer where user_id=?", [req.params.id], function (err, result) {
    if (err) throw err;
    res.status(200).json({
      result
    })
    console.log(result);
  });
})


router.post('/add', async (req, res) => {
  let sql = 'INSERT INTO customer SET ?'
  let post = {
    user_id: uuid.v1(),
    F_name: req.body.f_name,
    L_name: req.body.l_name,
    address: req.body.address,
    gender: req.body.gender,
    email: req.body.email
  }
  con.query(sql, post, (err, result) => {
    if (err) throw err;
    console.log('success');
    res.status(201).json({
      result
    })
    console.log(result);
  });
})


module.exports = router;

