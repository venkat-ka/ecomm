// app
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookiesParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
require("dotenv").config();
// import routes
const authRoutes = require('./routes/auth');

const userRoutes = require('./routes/user');

const categoryRoutes = require('./routes/category');

const productRoutes = require('./routes/product');
const brainTreeRoutes = require('./routes/braintree');
const orderRoutes = require('./routes/order');
// app
const app = express();





//db
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true
}).then(()=> console.log('DB connected'));

//route middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookiesParser());
app.use(expressValidator());
app.use(cors());
// routes middleware
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
app.use("/api",brainTreeRoutes);
app.use("/api", orderRoutes);
const port = process.env.PORT || 8000

app.listen(port, ()=>{
    console.log(`server running on port ${port}`);
})