const express = require("express");
const path = require("path");
const port = 3000;
const sqlite3 = require("sqlite3").verbose();

const app = express();

let db = new sqlite3.Database('store.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connect to Database ah ah ah ...')
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    const query = 'SELECT * FROM stores;';
    db.all(query, (err, rows) => {
        if (err) {
            return console.error('Error pull data:', err.message);
        }
        console.log(rows);
        res.render('show', { data : rows });
    });
});

app.post("/add", (req, res) => {
    
    const { name, product, address, tel } = req.body;

    db.run(
        `
        INSERT INTO stores (name, product, address, tel, status)
        VALUES (?, ?, ?, ?, ?)
        `,
        [name, product, address, tel, 'รอดำเนินการ'], 
        (err) => {
            if (err) return res.send(err.message);
            res.redirect("/");
        },
    );
});

app.post("/update/:id", (req, res) => {
    const id = req.params.id;
    const status = req.body.status;

    db.run(
        `
        UPDATE stores
        SET status = ?
        WHERE id = ?
        `,
        [status, id],
        (err) => {
            if (err) return res.send(err.message);
            res.redirect("/");
        },
    );
});

app.listen(port, () => {
    console.log("Server started.");
});
