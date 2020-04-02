const express = require('express')
const cors = require('cors');
const  bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const app = express();

app.use(cors());
app.use(bodyParser.json())

const uri = process.env.DB_PATH;

let client = new MongoClient(uri, { useNewUrlParser: true });
const users =  ['tom', 'Jerry', 'Nut', 'Multo'];


app.get('/products', (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({name: 'desktop'}).limit(20).toArray((err, documents) =>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(documents);
            }
        });
        client.close();
    });
});

 
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const name = users[id];
    res.send({id, name});
})

// POST
app.post('/addProduct', (req, res) =>{
    const product =  req.body;
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.insertOne(product, (err, result) =>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(result.ops[0]);
            }
        });
        client.close();
    });

   
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening to port 3000'))
