const express = require("express");
const path = require("path");
const port = 3000;
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.static("public"));
app.use(cookieParser());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    const endpoint = "http://10.110.194.140:8000/menu";
    fetch (endpoint)
        .then(response => response.json())
        .then(wsdata => {
            console.log(wsdata);
            res.render('show', {data:wsdata});
        })
        .catch(error => {
            console.log(error);
        });
});

app.get("/cart", async (req, res) => {
    const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    let items = [];
    for (let id of cart) {
        const endpoint = `http://10.110.194.140:8000/items/${id}`;
        const response = await fetch(endpoint);
        const data = await response.json();
        items.push(data);
    }

    res.render("cart", { data: items });
});

app.post("/addtocookie/:id", (req, res) => {
    const id = req.params.id;
    let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    cart.push(id);
    res.cookie('cart', JSON.stringify(cart), {
        maxAge: 1000*60*60
    });
    res.redirect("/")
});

app.get("/clear-cart", (req, res) => {
    res.clearCookie("cart");
    res.redirect("/cart");
});

app.listen(port, () => {
    console.log("start server");
});