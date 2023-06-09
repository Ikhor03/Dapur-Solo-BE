var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const productRoute = require('./app/product/router')
const categoryRoute = require('./app/category/router')
const tagRoute = require('./app/tag/router')
const authRoute = require('./app/auth/router')
const {decodeToken} = require('./middlewares')
const deliveryAddressRouter = require('./app/deliveryAddress/router')
const cartRoute = require('./app/cart/router')
const orderRoute = require('./app/order/router')
const invoiceRoute = require('./app/invoice/router')
const cors = require('cors')

var corsOptions = {
  origin:'http://localhost:3001',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.options('*', cors(corsOptions))
app.use(cors(corsOptions))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public/images/products')));
app.use(decodeToken())

app.use('/auth', authRoute)
app.use('/api', productRoute)
app.use('/api', categoryRoute)
app.use('/api', tagRoute)
app.use('/api', deliveryAddressRouter)
app.use('/api', cartRoute)
app.use('/api', orderRoute)
app.use('/api', invoiceRoute)

//home
app.use('/', function (req, res) {
  res.render('index', {
    title: 'Eduwork API Service'
  })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
