const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin')
admin.initializeApp();

const database = admin.database().ref('/cards');

const getItemsFromDatabase = (res) => {
    let items = [];

    return database.on('value', (snapshot) => {
        snapshot.forEach((item) => {
            items.push({
                id: item.key,
                item: item.val().item
            });
        });
        res.status(200).json(items);
    }, (error) => {
        res.status(error.code).json({
            message: `Something went wrong. ${error.message}`
        })
    })
};

exports.addCards = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(401).json({
                message: 'Not allowed'
            })
        }
        console.log(req.body)
        const item = req.body.item
        database.push({ item });
        getItemsFromDatabase(res)
    })
})

exports.getCards = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'GET') {
            return res.status(404).json({
                message: 'Not allowed'
            })
        }
        getItemsFromDatabase(res)
    })
})

exports.deleteCard = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'DELETE') {
            return res.status(401).json({
                message: 'Not allowed'
            })
        }
        const id = req.query.id
        admin.database().ref(`/items/${id}`).remove()
        getItemsFromDatabase(res)
    })
})