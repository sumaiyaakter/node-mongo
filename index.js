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
// 31.4 start
const users =  ['tom', 'Jerry', 'Nut', 'Multo'];
// 31.4 end


app.get('/products', (req, res) => {
    // ========== 32.2  Start ==========   
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
    // ========== 32.2  End ========== 
});

 
// 31.4 start
app.get('/users/:id', (req, res) => {
    // show details
    const id = req.params.id;
    const name = users[id];
    res.send({id, name});
})
// 31.4 end

// POST
app.post('/addProduct', (req, res) =>{
    const product =  req.body;
    // ========== 32.2  Start ==========   
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
    // ========== 32.2  End ========== 

   
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening to port 3000'))
