const API_URL = 'http://localhost:4000/api/tasks';

// Function to add a new task
async function addNewData(event) {
    event.preventDefault(); // Prevent form submission or page reload

    // Get the input field value
    const inputField = document.getElementById('inputText');
    const taskText = inputField.value.trim();

    // Check if the input is not empty
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    // Send the task to the server
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: taskText }),
        });

        if (!response.ok) {
            throw new Error('Failed to save task');
        }

        const newTask = await response.json();

        // Add the task to the UI
        addTaskToUI(newTask);

        // Clear the input field
        inputField.value = '';
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to add a task to the UI
function addTaskToUI(task) {
    const listItem = document.createElement('li');
    listItem.textContent = task.text;
    listItem.dataset.id = task._id; // Store the task ID in the list item

    // Add a "mark as complete" button
    const completeButton = document.createElement('button');
    completeButton.textContent = task.completed ? '✅' : '⬜';
    completeButton.classList.add('complete-btn');
    completeButton.onclick = function () {
        toggleComplete(task._id, listItem, completeButton);
    };

    // Add an edit button
    const editButton = document.createElement('button');
    editButton.textContent = '✏️';
    editButton.classList.add('edit-btn');
    editButton.onclick = function () {
        editTask(task._id, listItem);
    };

    // Add a delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '❌';
    deleteButton.classList.add('delete-btn');
    deleteButton.onclick = function () {
        deleteTask(task._id, listItem);
    };

    // Append the buttons to the list item
    listItem.appendChild(completeButton);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    // Add the new task to the list
    const listContainer = document.getElementById('list-containers');
    listContainer.appendChild(listItem);

    // Style the task if it's completed
    if (task.completed) {
        listItem.style.textDecoration = 'line-through';
    }
}

// Function to toggle task completion
async function toggleComplete(taskId, listItem, completeButton) {
    try {
        const isCompleted = listItem.style.textDecoration === 'line-through';
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !isCompleted }),
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        const updatedTask = await response.json();

        // Update the UI
        listItem.style.textDecoration = updatedTask.completed ? 'line-through' : 'none';
        completeButton.textContent = updatedTask.completed ? '✅' : '⬜';
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to edit a task
async function editTask(taskId, listItem) {
    const newText = prompt('Edit your task:', listItem.textContent);

    if (newText === null || newText.trim() === '') {
        return; // Do nothing if the user cancels or enters an empty string
    }

    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: newText.trim() }),
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        const updatedTask = await response.json();
        listItem.textContent = updatedTask.text; // Update the task text in the UI
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to delete a task
async function deleteTask(taskId, listItem) {
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }

        listItem.remove(); // Remove the task from the UI
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to load tasks from the server
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        tasks.forEach(addTaskToUI);
    } catch (error) {
        console.error('Failed to load tasks:', error);
    }
}

// Load tasks when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Optional: Add event listener for pressing "Enter" key in the input field
document.getElementById('inputText').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addNewData(event); // Call the addNewData function when Enter is pressed
    }
});