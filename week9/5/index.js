const express = require("express");
const path = require("path");
const port = 3000;
const sqlite3 = require("sqlite3").verbose()

const app = express();
const db = new sqlite3.Database("store.db", (err) => {
    if (err) return console.log(err.message);
    console.log("Connect to Database");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set("view engine", "ejs");

app.get("/", (req, res) =>{
    const query = `SELECT * FROM stores`;
    db.all(query, (err, rows) => {
        if (err) return res.send(err.message);
        res.render("show", { data : rows });
    });
});

app.post("/add", (req, res) => {
    const {name, product, address, tel} = req.body;
    const query = `INSERT INTO stores (name, product, address, tel, state) VALUES (?, ?, ?, ?, ?);`;
    db.all(query, [name, product, address, tel, "nostart"], (err) => {
        if (err) return res.send(err.message);
        res.redirect("/");
    });
});

app.post("/update/:id", (req, res) => {
    const id = req.params.id;
    const state = req.body.state;
    const query = `UPDATE stores SET state = ? WHERE id = ?;`;
    db.all(query, [state, id], (err) => {
        if (err) return res.send(err.message);
        res.redirect("/")
    });
});

app.listen(port, ()=> {
    console.log("Start server...");
})