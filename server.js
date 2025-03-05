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
const { createUser, findUserByEmail } = require('./modal'); 

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
const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create the Task model
const Task = mongoose.model('modal', taskSchema);


// Sign Up Endpoint
app.post('/api/User', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).send('User already exists.');
        }

        // Create a new user
        await createUser(name, email, password);
        res.status(201).send('User created successfully.');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal server error.');
    }
});

// Sign In Endpoint
app.post('/api/User/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).send('User not found.');
        }

        // Compare passwords (plaintext comparison for now, use bcrypt in production)
        if (user.password === password) {
            // Generate a token (dummy token for now, use JWT in production)
            const token = 'dummy-token';
            res.status(200).json({ token });
        } else {
            res.status(401).send('Invalid password.');
        }
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).send('Internal server error.');
    }
});

// Save a new task
app.post('/api/tasks', async (req, res) => {
    const { text } = req.body;

    try {
        const newTask = new Task({ text });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error saving task:', error);
        res.status(500).send('Internal server error.');
    }
});

// Get all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send('Internal server error.');
    }
});

// Edit a task
app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, { text }, { new: true });
        if (!updatedTask) {
            return res.status(404).send('Task not found.');
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).send('Internal server error.');
    }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).send('Task not found.');
        }
        res.status(200).json(deletedTask);
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send('Internal server error.');
    }
});

// Start the server
app.listen(PORT, async () => {
    await connectToMongoDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});