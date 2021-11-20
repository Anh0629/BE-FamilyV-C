const { config } = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors')
require('dotenv/config');






app.use(cors());
app.options('*',cors());
//MiddLeware nằm giữa req & res thực thi req trả về res or Midd khác
app.use(express.json());
app.use(morgan('tiny'));



const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
//const order_itemRouter = require('./routers/order_item');
const orderRouter = require('./routers/order');
const usersRouter = require('./routers/users');
const profilesRouter=require('./routers/profiles');




const api = process.env.API_URL;

//router
app.use(`${api}/products`, productsRouter);
app.use(`${api}/category`, categoriesRouter);
// app.use(`${api}/orderitem`, order_itemRouter);
app.use(`${api}/order`, orderRouter);
app.use(`${api}/user`, usersRouter);
app.use(`${api}/profile`, profilesRouter);



//connect mongodb
mongoose
    .connect(process.env.CONNECTION_STRING, {
        dbName: 'FamilyVC-database',
    })
    .then(() => {
        console.log('Database đã kết nối')
    })
    .catch((err) => {
        console.log(err)
    })

app.listen(4000, () => {
    console.log('server is running http://localhost:4000')
})
