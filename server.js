const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// MongoDB connection string
const MONGO_URL = 'mongodb+srv://tebogomaphatsoe:Kagoentle1234@cluster0.hwqnh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'todo_app'; // Replace with your actual database name
const COLLECTION_NAME = 'tasks'; // Replace with your actual collection name

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
let db;
async function connectToMongoDB() {
    const client = new MongoClient(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB');
}

// Save a new task
app.post('/api/tasks', async (req, res) => {
    try {
        const { text } = req.body;
        const collection = db.collection(COLLECTION_NAME);
        const result = await collection.insertOne({ text, completed: false });
        res.status(201).json(result.ops[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save task' });
    }
});

// Retrieve all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const collection = db.collection(COLLECTION_NAME);
        const tasks = await collection.find({}).toArray();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
});

// Update a task
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const collection = db.collection(COLLECTION_NAME);
        const result = await collection.updateOne(
            { _id: ObjectId(id) },
            { $set: { text } }
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const collection = db.collection(COLLECTION_NAME);
        const result = await collection.deleteOne({ _id: ObjectId(id) });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Start the server
app.listen(PORT, async () => {
    await connectToMongoDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});