const express = require('express');
const path = require('path');
const {Client} = require('pg');
// const serverless = require('serverless-http');
const cookieParser = require('cookie-parser');
const ejs = require('ejs')

const app = express();
// const body_parser = require('body-parser');
// const json_parser = body_parser.json();

const port = 3000;

/* routes */
const productRoutes = require('./routes/products');
const pageRoutes = require('./routes/load_page');
const userRoutes = require('./routes/user');
const previewRoutes = require('./routes/preview');
const cookieRoutes = require('./routes/cookie');

// console.log(__dirname);
// declare static path
let staticPath = path.join('dist', 'public');
app.use(express.static(staticPath));

let viewsStaticPath = path.join('dist', 'views');
app.use(express.static(viewsStaticPath));
// view engine setup
app.set('views', viewsStaticPath);
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express); //<-- this


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(json_parser);
// app.use(body_parser.urlencoded({extended: true}));
// app.use(json_parser);
// // home route
// app.get('/', (req, res) => res.sendFile(path.join('views', 'index.ejs')));

app.use(pageRoutes);
app.use(productRoutes);
app.use(userRoutes);
app.use(previewRoutes);
app.use(cookieRoutes);

app.get('/favicon.ico' , function(req , res){/*code*/});

// module.exports = app;
// module.exports.handler = serverless(app);
app.listen(process.env.PORT || port, () => console.log(`Ecommerce App listening on port ${port}!`));
