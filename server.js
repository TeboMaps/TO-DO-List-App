const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

// MongoDB connection string
const MONGO_URL = 'mongodb+srv://tebogomaphatsoe:Kagoentle1234@cluster0.hwqnh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'todo_app'; // Replace with your actual database name
const COLLECTION_NAME = 'tasks'; // Replace with your actual collection name
const COLLECTION_NAME2 = 'User';

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

//login
// Registration endpoint
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

    try {
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(400).send('Error registering user: ' + error.message);
    }
});

// Login endpoint
app.post('/api/User', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: User._id }, 'your_jwt_secret_key'); // Replace with your JWT secret key
    res.json({ token });
});

// Save a new task
app.post('/api/User', async (req, res) => {
    try {
        const { text } = req.body;
        const collection = db.collection(COLLECTION_NAME2);
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