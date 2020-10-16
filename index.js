const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zeypn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get('/', (req, res) =>{
    res.send("hello from db it's working working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const servicesCollection = client.db("creativeAgency").collection("services");
    const feedbacksCollection = client.db("creativeAgency").collection("feedbacks");
    const ordersCollection = client.db("creativeAgency").collection("orders");
  
    // services 
    app.get('/services', (req, res) => {
        servicesCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        });
    })

    // feedbacks
    app.get('/feedbacks', (req, res) => {
        feedbacksCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.post('/addfeedback', (req, res) => {
        const newFeedback = req.body;
        feedbacksCollection.insertOne(newFeedback).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    // Orders 
    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        ordersCollection.insertOne(newOrder).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    app.get('/serviceList', (req, res) => {
        ordersCollection.find({email: req.query.email}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    app.get('/admin/serviceList', (req, res) => {
        ordersCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

});

app.listen(process.env.PORT || port)