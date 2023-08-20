const express = require('express')
const mongoose = require('mongoose')
const Product = require('./models/productModel')
var colors = require('colors');
const app = express();


const dbUrl = "mongodb+srv://<User name >:<password>@sanjeev.azt1apt.mongodb.net/databasenme"

//middleware
app.use(express.json());

//route
app.get('/', (req, res) => {
    res.send("Node API page 1")
})
app.get('/blog', (req, res) => {
    res.send("hello Blog page 2 .....")
})


// route to send data in db ------------------------------------------------------
app.post('/product', async(req,res)=>{
   try{
       const product = await Product.create(req.body)
       res.status(200).json("Product successfully added")
   } catch(error){
       console.log(error.message);
       res.status(500).json({message: error.message})
   }
})

//fetch data from mongodb ------------------------------------------------------
app.get('/products', async(req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch(error) {
        res.status(500).json({message: error.message})
    }
})

//fetch particular product by id ------------------------------------------------
app.get('/products/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update data in database  use put or patch --------------------------------------
app.put('/products/:id', async(req,res) => {
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        //we cannot find any product in database
        if(!product){
            return res.status(404).json({message: `cannot find any product with ID ${id}`})
        }
        const updateProduct = await Product.findById(id)
        res.status(200).json(updateProduct);

    } catch(error) {
        res.status(500).json({message: error.message})
    }
})

// remove or delete data 
app.delete('/products/:id', async(req,res) => {
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({ message: `cannot find any product with ID ${id}` })
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


mongoose.connect(dbUrl)
    .then(() => {
        console.log(colors.bgBrightCyan("server is running and in development mode ......."))
        app.listen(3000, ()=>
            console.log(colors.bgBrightYellow("database connected successfully ......"))
        )
    }).catch((error) => {
        console.log(error)
    });
