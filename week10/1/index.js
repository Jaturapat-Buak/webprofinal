const express = require("express");
const path = require("path");
const port = 3000;
const sqlite3 = require("sqlite3").verbose()

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    const endpoint = "http://10.110.194.140:8000/menu";
    fetch (endpoint) 
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            res.render("show", {data:data});
        })
        .catch((error) => {
            console.log(error);
        });
});

app.get("/more/:id", (req, res) => {
    const id = req.params.id;
    const endpoint = `http://10.110.194.140:8000/items/${id}`;
    fetch (endpoint)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            res.render("info", { data:data });
        })
        .catch((error) => {
            console.log(error);
        });
});

app.listen(port, () => {
    console.log("Start web");
});