const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://tebogomaphatsoe:Kagoentle1234@cluster0.hwqnh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected.');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Create a schema for the User
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create a model for the User
const User = mongoose.model('User', userSchema);

// Function to create a new user
const createUser = async (name, email, password) => {
    try {
        const newUser = new User({ name, email, password });
        await newUser.save();
        console.log('User created:', newUser);
    } catch (error) {
        console.error('Error creating user:', error);
    }
};

// Function to find a user by email
const findUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found.');
            return null;
        }
        console.log('User found:', user);
        return user;
    } catch (error) {
        console.error('Error finding user:', error);
        return null;
    }
};

// Function to update user's password
const updateUserPassword = async (email, newPassword) => {
    try {
        const user = await User.findOneAndUpdate({ email }, { password: newPassword }, { new: true });
        if (!user) {
            console.log('User not found.');
            return null;
        }
        console.log('User password updated:', user);
        return user;
    } catch (error) {
        console.error('Error updating password:', error);
        return null;
    }
};

// Function to delete a user
const deleteUser = async (email) => {
    try {
        const user = await User.findOneAndDelete({ email });
        if (!user) {
            console.log('User not found.');
            return null;
        }
        console.log('User deleted:', user);
        return user;
    } catch (error) {
        console.error('Error deleting user:', error);
        return null;
    }
};

module.exports = {
    createUser,
    findUserByEmail,
    updateUserPassword,
    deleteUser
};
