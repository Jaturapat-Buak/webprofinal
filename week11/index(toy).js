const express = require('express')
const app = express()
const sqlite3 = require('sqlite3').verbose()
const port = 3000
const cookieParser = require("cookie-parser")
const session = require('express-session')

const db = new sqlite3.Database('em.db', (err) =>{
    if (err){
        console.error(err.message)
    }
    console.log("sussess")
})

app.use(session({
    secret: 'your-secret-key-for-your-store',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 10 * 60000 }
}))

app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use(express.static("public"))
app.use(cookieParser())

app.get('/', (req,res) => {
    const endpoint = 'http://10.110.194.140:8000/menu'
    fetch(endpoint)
        .then(response => response.json())
        .then( data => {
            res.render('home', {data: data})
        })
        .catch(error =>{
            console.log(error)
        })
})

app.get('/add/:id', (req, res) => {
    // const id = req.params.id
    // const endpoint = `http://10.110.194.140:8000/items/${id}`
    // fetch(endpoint)
    //     .then(response => response.json())
    //     .then(item => {
    //         let cart = []
    //         if (req.cookies.foods) {
    //             cart = JSON.parse(req.cookies.foods)
    //         }
    //         cart.push(item)

    //         res.cookie('foods', JSON.stringify(cart), {
    //             maxAge: 1000 * 60,
    //             httpOnly: true
    //         })
    //         res.redirect('/')
    //     })
    const id = req.params.id;
    if (!req.session.cart){
        req.session.cart = []
    }
    const endpoint = `http://10.110.194.140:8000/items/${id}`
    fetch(endpoint)
        .then(response => response.json())
        .then(item => {
            req.session.cart.push({
                id: item.id,
                name: item.name,
                price: item.price
                
            })
            res.redirect('/');
        })
        .catch(error => {
            console.log(error);
            res.send("Error adding item");
        });
})
app.get('/cart', (req,res) =>{
    // const cookieData = req.cookies.foods
    // let parsedData
    // if (cookieData){
    //     parsedData = JSON.parse(cookieData)
    // }
    // else{
    //     parsedData = []
    // }
    // res.render('cart', {data:parsedData})
    
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + Number(item.price), 0); // <-- 0 คือ initialValue
    res.render('cart', { data: cart, total: total });
    })

app.get('/confirm', (req,res) => {
        req.session.cart = [];
        res.redirect('/');
    })

app.listen(port)
