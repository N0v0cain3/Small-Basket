
function addProduct() {
  document.getElementById("submitBtn").disabled = true;
  var formData = new FormData();

  formData.append("p_name", document.getElementById("product_name").value);
  formData.append("p_price", document.getElementById("product_price").value);
  formData.append("quantity", document.getElementById("product_quantity").value);
  formData.append("p_expiry", document.getElementById("expiry_date").value);// number 123456 is immediately converted to a string "123456"
  var inputFile = document.getElementById("product_url")
  // HTML file input, chosen by user
  formData.append("image", inputFile.files[0], document.getElementById("product_url").value);



  var request = new XMLHttpRequest();
  request.open("POST", "http://localhost:3000/admin/addProduct", true);
  request.send(formData)
  request.onload = function () {
    if (this.status == 201)
      alert("Created")
    location.reload();
  }
  // var product = {

  //   p_name: document.getElementById("product_name").value,
  //   p_price: document.getElementById("product_price").value,
  //   // p_url: document.getElementById("product_url").value
  //   // p_price: 131

  //   // email: document.getElementById("email").value,
  //   // password: document.getElementById("pwd1").value,
  //   // first_name: document.getElementById("fname").value,
  //   // last_name: document.getElementById("lname").value,
  // };
  // var xhr = new XMLHttpRequest();
  // xhr.open("POST", "http://localhost:3000/admin/addProduct", true);
  // xhr.setRequestHeader("Content-Type", "application/json");
  // xhr.send(JSON.stringify(product));
  // xhr.onload = function () {
  //   if (this.status == 201) {
  //     var data = JSON.parse(this.responseText);
  //     alert("Created!")
  //   } else {
  //     var data = JSON.parse(this.responseText);
  //     document.getElementById("errorHandler").innerHTML =
  //       "Account already exists with this email!";
  //     document.getElementById("btnsubmit").disabled = false;
  //   }
  // };

}
function addToCart(p_id) {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "http://localhost:3000/cart/add",
    true
  );
  var product = {
    p_id: p_id,
    cart_id: "e33d9830-160e-11eb-aa5c-730e087e6594",
    customer_id: "dsa"
  }
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(product));
  xhr.onload = function () {
    if (this.status == 201) {
      alert("added to cart")
    }
    else if (this.status == 400) {
      alert("SORRY NO SUCH ITEM LEFT")
    }
    else {
      alert("thathi thatu")
    }
  }
}

function getProductsAdmin() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "http://localhost:3000/products/all",
    true
  );
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send();
  xhr.onload = function () {
    // // console.log(this.status)
    if (this.status == 200) {
      data = JSON.parse(this.responseText);
      for (i = 0; i < data.result.length; i++) {
        var id = (data.result[i].p_id).toString()
        console.log(typeof (id))
        $("#products").append(`
       
        <div class="col-md-4">
        <div class="card my-3" style="width: 18rem;">

        <img src="${data.result[i].p_url}" width="90%" height="250px" style="object-fit:cover;" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${data.result[i].p_name}</h5>
          <p class="card-text">Price Rs ${data.result[i].p_price}</p>
          <p class="card-text">Available quantity ${data.result[i].quantity}</p>
          <a href="#" class="btn btn-danger" id="removeProduct" onclick="removeProduct('${id}')" style="margin:5px"><i class="fa fa-trash"></i> Delete product</a >
          <a href="modify.html?id=${id}" class="btn btn-warning" id="modifyProduct" style="margin:5px"><i class="fa fa-edit"></i> Modify product</a >
        </div>
        </div>
      </div>`)
      }
      console.log(data.result)


    } else {
      console.log("thathi thatu")
    }
  };
}


function showSingleProduct() {
  let url = new URL(window.location.href);
  var product_id = url.searchParams.get("id")
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `http://localhost:3000/products/${product_id}`,
    true
  );
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send();
  xhr.onload = function () {
    // // console.log(this.status)
    if (this.status == 200) {
      data = JSON.parse(this.responseText);
      console.log(data)
      for (i = 0; i < data.result.length; i++) {
        var id = (data.result[i].p_id).toString()
        console.log(typeof (id))
        $("#modi").append(`
       
        <div class="col-md-4">
        <div class="card my-3" style="width: 18rem;">

        <img src="${data.result[i].p_url}" width="90%" height="250px" style="object-fit:cover;" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${data.result[i].p_name}</h5>
          <p class="card-text">Price Rs ${data.result[i].p_price}</p>
          <p class="card-text">Available quantity ${data.result[i].quantity}</p>
        </div>
        </div>
      </div>`)
      }
      console.log(data.result)


    } else {
      console.log("thathi thatu")
    }
  };
}

function modifyProduct() {
  let url = new URL(window.location.href);
  var product_id = url.searchParams.get("id")
  console.log("this one", product_id)
  // showSingleProduct(product_id);
  var xhr = new XMLHttpRequest();
  xhr.open(
    "PATCH",
    `http://localhost:3000/admin/modify/${product_id}`,
    true
  );
  const p_name = document.getElementById("modifyName").value;
  const p_price = document.getElementById("modifyPrice").value;
  const quantity = document.getElementById("modifyQuantity").value;


  var product = {
    p_name: p_name,
    p_price: p_price,
    quantity: quantity

  }

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(product));
  xhr.onload = function () {
    if (this.status == 201) {
      alert("Modified!");
      location.reload();
    }
    else {
      alert("some error occured")
    }
  }
}

function removeProduct(product_id) {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "DELETE",
    `http://localhost:3000/products/${product_id}`,
    true
  );
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send();
  xhr.onload = function () {
    if (this.status == 200) {
      alert("Product Deleted!");
      location.reload()
    }


  }

}

function getProducts() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "http://localhost:3000/products/all",
    true
  );
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send();
  xhr.onload = function () {
    // // console.log(this.status)
    if (this.status == 200) {
      data = JSON.parse(this.responseText);
      for (i = 0; i < data.result.length; i++) {
        var id = (data.result[i].p_id).toString()
        console.log(typeof (id))
        $("#products").append(`
       
        <div class="col-md-4">
        <div class="card my-3" style="width: 18rem;">

        <img src="${data.result[i].p_url}" width="90%" height="250px" style="object-fit:cover;" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${data.result[i].p_name}</h5>
          <p class="card-text">Price Rs ${data.result[i].p_price}</p>
          <p class="card-text">Available quantity ${data.result[i].quantity}</p>
          <p class="card-text">Expired at ${data.result[i].p_expiry}</p>
          <a href="#" class="btn btn-primary" id="addCart" onclick="addToCart('${id}')" style="margin:5px"><i class="fa fa-shopping-cart"></i> Add to cart</a >
        
        </div>
        </div>
      </div>`)
      }
      console.log(data.result)


    } else {
      console.log("thathi thatu")
    }
  };
}

function showCart() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "http://localhost:3000/cart/e33d9830-160e-11eb-aa5c-730e087e6594",
    true
  );
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send();
  xhr.onload = function () {
    if (this.status == 200 || 201) {
      data = JSON.parse(this.responseText);
      console.log(data)
      for (i = 0; i < data.result.length; i++) {
        console.log(i)
        var p_id = data.result[i].product_id;
        var c_id = data.result[i].cart_id;
        var date = new Date(data.result[i].p_expiry)
        date = `Expires on: ${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`
        $("#cart").append(` <div class="col-md-4"> <div class="card" style="width: 18rem;">
        
        <img src="${data.result[i].p_url}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${data.result[i].p_name}</h5>
          <p class="card-text">Price Rs ${data.result[i].p_price}</p>
          <a href="#" class="btn btn-danger" id="addCart" onclick="deleteFromCart('${p_id}','${c_id}')" style="margin:5px"><i class="fa fa-shopping-cart"></i> Remove from the cart</a >
          <a href="#" class="btn btn-warning style="margin:5px">${date}</a>
        </div>
      </div>
      </div>
      `)
      }
    } else {
      console.log("error")
    }
  }

}

function deleteFromCart(product_id, cart_id) {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "DELETE",
    "http://localhost:3000/cart/item",
    true
  );
  var product = {
    product_id: product_id,
    cart_id: cart_id
  }
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(product));
  xhr.onload = function () {
    if (this.status < 400) {
      alert("removed");
      location.reload();
    }
    else {
      alert("error removing the item")
    }
  }


}

function showBill() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "http://localhost:3000/cart/e33d9830-160e-11eb-aa5c-730e087e6594/bill",
    true
  );

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send();
  xhr.onload = function () {
    data = JSON.parse(this.responseText);
    if (this.status < 400) {
      console.log(data)
      $("#bill").append(`<p style="text-align:center;">Total amount : ${data.sum}</p>`)
    }

  }
}


function placeOrder() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "http://localhost:3000/cart/order",
    true
  );
  const product = {
    "customer_id": "7e6ef700-1933-11eb-8137-a734cbced89d",
    "cart_id": "e33d9830-160e-11eb-aa5c-730e087e6594"
  }
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(product));
  xhr.onload = function () {
    data = JSON.parse(this.responseText);
    console.log(data)
    if (this.status == 200) {
      $("#show").css('display', 'none')
      console.log("order", data)
      $("#place").css('display', 'block')
      $("#deta").append(`<div>
      <p>
         <div> <b>Shipping address</b> : ${data.customer[0].address}</div>
          <div> <b>Name</b> : ${data.customer[0].F_name}</div>
          <div> <b>Email</b> : ${data.customer[0].email}</div>
        </p>
      </div>`)
      for (i = 0; i < data.cart.length; i++) {
        $("#deta").append(`<div>
        
        <br><hr>
        <div class="row">
        <div class="col-md-4">
        <img height="auto" width="69%" src="${data.cart[i].p_url}">
        </div>
        <div class="col-md-8 row align-items-center"  >
        <div class="col-6"><b>Name</b> : ${data.cart[i].p_name}</div>
        <div class="col-6"><b>Price</b> : ${data.cart[i].p_price}</div>
        
        </div>
        </div>
      
      </div>`)


      }

    }
  }
}

function searchProduct() {
  event.preventDefault()
  const product = document.getElementById("searchproduct").value;
  // var product = $("#searchproduct").val();
  console.log(product)

  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `http://localhost:3000/products/search/${product}`,
    true
  );

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send();
  xhr.onload = function () {
    data = JSON.parse(this.responseText);
    if (this.status < 400) {
      console.log(data)
      $("#search").html("");
      $("#products").css("display", "none")
      for (i = 0; i < data.result.length; i++) {
        var id = (data.result[i].p_id).toString()
        console.log(typeof (id))


        $("#search").append(`
       
        <div class="col-md-4">
        <div class="card my-3" style="width: 18rem;">

        <img src="${data.result[i].p_url}" width="90%" height="250px" style="object-fit:cover;" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${data.result[i].p_name}</h5>
          <p class="card-text">Price Rs ${data.result[i].p_price}</p>
          <a href="#" class="btn btn-primary" id="addCart" onclick="addToCart('${id}')" style="margin:5px"><i class="fa fa-shopping-cart"></i> Add to cart</a >
        
        </div>
        </div>
      </div>`)
      }
      console.log(data.result)


    }

  }

}
