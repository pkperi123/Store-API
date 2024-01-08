require('dotenv').config()
require('express-async-errors')
const express = require('express');
const notFoundMiddleware = require('./middleware/not_found')
const errorHandlerMiddleware = require('./middleware/error_handler')
const connectDB = require('./db/connect')
const productRouter = require('./routes/product')


const app = express();
const port = 3000;



//middleware
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('<h1>store api</h1> <a href="/api/v1/products">products route</a>')
})

app.use('/api/v1/products',productRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async () => {
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(port,()=>{
            console.log(`server started at port number ${port}`)
        });
    }catch(error){
        console.log(error);
    }
}

start()


