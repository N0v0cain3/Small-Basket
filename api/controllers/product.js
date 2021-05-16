const { Router } = require("express");
const router = Router();
const mysql = require("mysql");
//database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "smallbasket",
  port: "3506"
});



router.get("/search/:name", async (req, res) => {
  let name = req.params.name;
  name = name.substring(0, 4)
  name = `%${name}%`
  con.query("SELECT * FROM PRODUCT WHERE p_name LIKE  ?  ", name, (err, result) => {
    if (err)
      throw err;
    else {
      res.status(200).send({
        result
      })
    }
  })

})
router.get("/all", async (req, res) => {
  console.log("FROM ALLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL")

  console.log("get all products");
  var sql = "select * from product;";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.status(200).json({
      result
    })
    console.log(result);
  });

})

router.get("/:p_id", async (req, res) => {
  con.query("SELECT * FROM PRODUCT WHERE p_id = ? ", [req.params.p_id], function (err, result) {
    if (err) throw err;
    res.status(200).json({
      result
    })
    console.log(result);
  });

})

router.delete("/:id", async (req, res) => {
  con.query("DELETE FROM PRODUCT WHERE p_id=?", [req.params.id], function (err, result) {
    if (err) {
      throw err;
    }
    else {
      res.status(200).json({
        message: "success"
      })
    }
  })

})





module.exports = router;

