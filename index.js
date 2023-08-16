const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const app = express();
const PORT = 3055;
const MONGODB_URI = 'mongodb://0.0.0.0:27017/';
const DB_NAME = 'atmDB';

// Connect to MongoDB
MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true })
  .then((client) => {
    const db = client.db(DB_NAME);
    console.log('Connected to MongoDB');

// mongoose.connect('mongodb://0.0.0.0:27017/atmDB').then(() => {
//   console.log('Connected to the Database successfully');
//  }).catch(err=>{
//    console.log(err);
//  });

    

    // Middleware to parse request body as JSON
    app.use(express.json());

    // Endpoint to create a new account with initial balance
    app.post('/api/accounts', (req, res) => {
      const { balance } = req.body;
      const account = {
        balance: parseFloat(balance),
        transactions: [],
      };

      db.collection('accounts')
        .insertOne(account)
        .then((result) => {
          res.status(201).json({ accountId: result.insertedId });
        })
        .catch((error) => {
          console.error('Error creating account:', error);
          res.status(500).json({ error: 'Unable to create account' });
        });
    });

    // Endpoint to perform a credit transaction
    app.post('/api/accounts/:accountId/credit', (req, res) => {
      const accountId = req.params.accountId;
      const { amount } = req.body;

      db.collection('accounts')
        .findOneAndUpdate(
          { _id: new ObjectId(accountId) },
          {
            $push: { transactions: { type: 'credit', amount: parseFloat(amount), timestamp: new Date() } },
            $inc: { balance: parseFloat(amount) },
          },
          { returnOriginal: false }
        )
        .then((result) => {
          if (!result.value) {
            return res.status(404).json({ error: 'Account not found' });
          }
          res.status(200).json({ message: 'Credit transaction successful', account: result.value });
        })
        .catch((error) => {
          console.error('Error performing credit transaction:', error);
          res.status(500).json({ error: 'Unable to perform credit transaction' });
        });
    });

    // Endpoint to perform a debit transaction
    app.post('/api/accounts/:accountId/debit', (req, res) => {
      const accountId = req.params.accountId;
      const { amount } = req.body;

      db.collection('accounts')
        .findOneAndUpdate(
          { _id: new ObjectId(accountId), balance: { $gte: parseFloat(amount) } },
          {
            $push: { transactions: { type: 'debit', amount: parseFloat(amount), timestamp: new Date() } },
            $inc: { balance: -parseFloat(amount) },
          },
          { returnOriginal: false }
        )
        .then((result) => {
          if (!result.value) {
            return res.status(400).json({ error: 'Insufficient balance or account not found' });
          }
          res.status(200).json({ message: 'Debit transaction successful', account: result.value });
        })
        .catch((error) => {
          console.error('Error performing debit transaction:', error);
          res.status(500).json({ error: 'Unable to perform debit transaction' });
        });
    });

    // Endpoint to get the account balance
    app.get('/api/accounts/:accountId/balance', (req, res) => {
      const accountId = req.params.accountId;

      db.collection('accounts')
        .findOne({ _id: new ObjectId(accountId) })
        .then((result) => {
          if (!result) {
            return res.status(404).json({ error: 'Account not found' });
          }
          res.status(200).json({ balance: result.balance });
        })
        .catch((error) => {
          console.error('Error fetching account balance:', error);
          res.status(500).json({ error: 'Unable to fetch account balance' });
        });
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    app.timeout = 500000;
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
