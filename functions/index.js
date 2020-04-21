const functions = require('firebase-functions');
const bodyParser = require('body-parser');
const express = require('express');
const firebaseAdmin = require('firebase-admin')

firebaseAdmin.initializeApp(functions.config().firebase);
const db = firebaseAdmin.firestore();

server = express()
server.use(bodyParser.urlencoded({extended: true}));

server.get('/contacts', (req, res) => {
    db.collection('ourcontacts').get()
    .then(documentSet => {
        const ourcontacts = []
        documentSet.forEach(contact => ourcontacts.push(contact.data()))
        res.json(ourcontacts)
    })
    .catch((err) => res.json({error: err})) 
})

server.post('/contacts', (req, res) => {
    const id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
    
    db.collection('ourcontacts').doc(id).set(req.body)
        .then(() => res.json(['created']))
        .catch(() => res.json(['failed']));
})

exports.api = functions.https.onRequest(server);