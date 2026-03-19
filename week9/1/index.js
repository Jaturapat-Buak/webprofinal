const express = require("express");
const path = require("path");
const port = 3000;
const sqlite3 = require('sqlite3').verbose();

const app = express();

let db = new sqlite3.Database('userdata.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to SQlite database.');
});

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    db.all("SELECT * FROM users", (err, rows) => {
        if (err) return console.log(err.message);
        res.render("show", { data: rows });
    });
});

app.get('/detail/:id', (req, res) => {
    const id = req.params.id;

    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) return console.log(err.message);
        res.render("detail", { user: row });
    });
});

app.listen(port, () => {
    console.log("Server started.");
});