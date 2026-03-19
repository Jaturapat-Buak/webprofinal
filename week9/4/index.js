const express = require("express");
const path = require("path");
const port = 3000;
const sqlite3 = require("sqlite3").verbose();

const app = express();
const db = new sqlite3.Database("store.db", (err) => {
    if (err) return console.error(err.message);
    console.log("Connected to Database...");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    const query = `SELECT * FROM stores;`
    db.all(query, (err, rows) => {
        if (err) return res.send(err.message);
        res.render("store", { data : rows });
    });
});

app.post("/add", (req, res) => {
    const { name, product, address, tel } = req.body;
    const query = `INSERT INTO stores (name, product, address, tel, status) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [name, product, address, tel, 'รอดำเนินการ'], (err) => {
        if (err) return res.send(err.message);
        res.redirect("/");
    });
});

app.post("/update/:id", (req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    const query = ` UPDATE stores SET status = ? WHERE id = ?;`;
    db.run(query, [status, id], (err) => {
        if (err) return res.send(err.message);
        res.redirect("/");
    });
});

app.get("/edit/:id", (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM stores WHERE id = ?`;
    db.get(query, [id], (err, rows) => {
        if (err) return res.send(err.message);
        res.render("update", { data : rows });
    })
})

app.post("/edit/:id", (req, res) => {
    const id = req.params.id;
    const {name, product, address, tel} = req.body;
    const query = `UPDATE stores SET name = ?, product = ?, address = ?, tel = ? WHERE id = ?`;
    db.run(query, [name, product, address, tel, id], (err) => {
        if (err) return res.send(err.message);
        res.redirect("/");
    });
});

app.post("/delete/:id", (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM stores WHERE id = ?`
    db.run(query, [id], (err) => {
        if (err) return res.send(err.message);
        res.redirect("/")
    });
});

app.listen(port, () => {
    console.log("Server running");
});