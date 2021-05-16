const { Router } = require("express");
const router = Router();
const uuid = require("uuid")
const mysql = require("mysql");
const nodemailer = require("nodemailer")
require("dotenv").config();
//database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "smallbasket",
  port: "3506"
});



router.get("/add", async (req, res) => {


  var sql = "select * from product;";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.status(200).json({
      result
    })
    console.log(result);
  });

})

// router.patch('/add', async (req, res) => {
//   let sql = 'UPDATE product SET p_name= ? WHERE p_id =?'
//   let post = {
//     p_id: req.body.p_id,
//     p_name: req.body.p_name,
//   }
//   await con.query(sql, [req.body.p_name, req.body.p_id], (err, result) => {
//     if (err) throw err;
//     console.log('success');
//     res.status(201).json({
//       result
//     })
//     console.log(res);
//   });
// })

router.post("/add", async (req, res) => {
  con.query("Select * from cart where customer_id=?", [req.body.customer_id], async (err, result) => {
    if (err) throw err;
    console.log('success');

    await con.query("SELECT * FROM product where p_id=?", [req.body.p_id], (err, result1) => {
      console.log("maal", result1[0].quantity)
      if (result1[0].quantity <= 0) {
        res.status(400).json({
          message: "khali hogaya maal"
        })
      }
      else {
        // con.query(sql, post, (err, result) => {
        //   if (err) throw err;
        //   console.log('success');
        // res.status(201).json({
        //   result
        // })
        res.status(201).json({
          result
        })

        // });
      }


      if (result.length == 0) {
        con.query("INSERT INTO cart SET ?", { cart_id: uuid.v1(), customer_id: req.body.customer_id }, (err, result) => {
          if (err) throw err;
          console.log('success');
          // res.status(201).json({
          //   result
          // })

        });

      }
    });

    let sql = 'INSERT INTO cart_product SET ?'
    let post = {
      product_id: req.body.p_id,
      cart_id: req.body.cart_id
    }


    con.query(sql, post, (err, result) => {
      if (err) throw err;
      console.log('success');
      // res.status(201).json({
      //   result
      // })

    });


  })

})

router.get("/:id", async (req, res) => {
  let sql = 'Select * from cart_product left join product on cart_product.product_id = product.p_id where cart_id = ? '
  con.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    console.log('success');
    res.status(201).json({
      result
    })
    console.log(result);
  });
})

router.post("/order", async (req, res) => {
  const { customer_id, cart_id } = req.body;
  let sql = 'Select * from cart_product left join product on cart_product.product_id = product.p_id where cart_id = ? '
  await con.query(sql, [cart_id], async (err, cart) => {
    if (err) throw err;
    for (i in cart) {
      console.log(cart[i].p_name)
      var quantity = cart[i].quantity;
      quantity = quantity - 1;
      await con.query("update product set quantity = ? where p_id = ?", [quantity, cart[i].p_id], (err, update) => {
        if (err) throw err;
        console.log("updated")

      })
    }

    await con.query("select * from customer where user_id=?", [customer_id], (err, customer) => {
      if (err) throw err;
      console.log('success');
      console.log(customer, cart);
      let transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL, // your gmail address
          pass: process.env.PASSWORD, // your gmail password
        },
      });
      let mailOptions = {
        subject: `Thanks for your order`,
        to: "nousernameidea0709@gmail.com",
        from: `SMALL BASKET`,
        html: `    
          <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Demystifying Email Design</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin: 0; padding: 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%"> 
                <tr>
                    <td style="padding: 10px 0 30px 0;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;">
                            <tr>
                                <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                                    <img src="https://certify-hax.s3.ap-south-1.amazonaws.com/smallBasket/basket.png" alt="SMART CCTV" width="300" height="230" style="display: block;" />
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                                <b>Hey ${customer[0].F_name}!,  </b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                                We have recieved your order! ( order id : ${cart[0].cart_id}) 
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td width="260" valign="top">
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                <tr>
                                                                    <td>
                                                                        <img src="${cart[0].p_url}" alt="" width="100%" height="140" style="display: block;" />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="padding: 25px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                                                       Item : ${cart[0].p_name} , Price : ${cart[0].p_price}

                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                        <td style="font-size: 0; line-height: 0;" width="20">
                                                            &nbsp;
                                                        </td>
                                                        <td width="260" valign="top">
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                <tr>
                                                                    <td>
                                                                        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/right.gif" alt="" width="100%" height="140" style="display: block;" />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="padding: 25px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                                                        Got any queries ? contact us.
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#ee4c50" style="padding: 30px 30px 30px 30px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;" width="75%">
                                                &reg; Small Basket , New York 2020<br/>
                                                <a href="#" style="color: #ffffff;"><font color="#ffffff">Unsubscribe</font></a> to this newsletter instantly
                                            </td>
                                            <td align="right" width="25%">
                                                <table border="0" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
                                                            <a href="http://www.twitter.com/" style="color: #ffffff;">
                                                                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/tw.gif" alt="Twitter" width="38" height="38" style="display: block;" border="0" />
                                                            </a>
                                                        </td>
                                                        <td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
                                                        <td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
                                                            <a href="http://www.twitter.com/" style="color: #ffffff;">
                                                                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/fb.gif" alt="Facebook" width="38" height="38" style="display: block;" border="0" />
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
                  `,
      };
      try {
        transporter.sendMail(mailOptions, (error, response) => {
          if (error) {
            // res.status(500).json(("could not send "));
            console.log(error)
            res.status(400).json({
              message: "unsuccessful"
            })
            console.log("fail ", mailOptions.to);
          } else {
            console.log("gg", mailOptions.to);
            res.status(200).json({
              message: "success",
              cart,
              customer
            })
          }

        });
      } catch (error) {
        res.status(500).send("could not send");
      }


    })

  });




})

router.delete("/item", async (req, res) => {
  con.query("DELETE FROM cart_product WHERE product_id = ? AND cart_id = ?", [req.body.product_id, req.body.cart_id], function (err, result) {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    }
    else {
      console.log(result)
      res.status(200).json({
        "message": "deleted"
      })
    }
  });
})

router.get("/:id/bill", async (req, res) => {
  let sql = 'Select * from cart_product left join product on cart_product.product_id = product.p_id where cart_id = ? '
  con.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    console.log('success');
    let sum = 0;
    for (i in result) {
      sum = sum + result[i].p_price
    }
    res.status(201).json({
      sum
    })
    console.log(result);
  });
})

module.exports = router;

