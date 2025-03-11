const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

// MongoDB connection string
const MONGO_URL = 'mongodb+srv://tebogomaphatsoe:Kagoentle1234@cluster0.hwqnh.mongodb.net/todo_app?retryWrites=true&w=majority';
const DB_NAME = 'todo_app'; // Replace with your actual database name
const COLLECTION_NAME = 'tasks'; // Replace with your actual collection name


// Middleware
app.use(cors());
//app.use(bodyParser.json());
app.use(express.json());


// Connect to MongoDB
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
});

// Define the Task schema
const taskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

const Task = mongoose.model('Task', taskSchema);

// API Endpoints

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

// Add a new task
app.post('/api/tasks', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: 'Task text is required' });
    }

    try {
        const newTask = new Task({ text });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error saving task:', error);
        res.status(500).send('Internal server error.');
    }
});

// Update a task (mark as complete or edit text)
app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { text, completed },
            { new: true }
        );

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});