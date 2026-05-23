// DOM elements
const taskForm = document.getElementById('task-form');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const prioritySelect = document.getElementById('priority');
const dueDateInput = document.getElementById('due-date');
const submitBtn = document.getElementById('submit-btn');
const statusFilter = document.getElementById('status-filter');
const priorityFilter = document.getElementById('priority-filter');
const tasksContainer = document.getElementById('tasks-container');
const noTasksMsg = document.getElementById('no-tasks');

// Global variables
let tasks = [];
let editId = null;

// Load tasks from LocalStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    renderTasks();
}

// Save tasks to LocalStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
    tasksContainer.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        const statusMatch =
            statusFilter.value === 'all' || task.status === statusFilter.value;
        const priorityMatch =
            priorityFilter.value === 'all' || task.priority === priorityFilter.value;
        return statusMatch && priorityMatch;
    });

    if (filteredTasks.length === 0) {
        noTasksMsg.style.display = 'block';
    } else {
        noTasksMsg.style.display = 'none';

        filteredTasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = `task-card ${task.status}`;

            taskCard.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description || 'No description'}</p>
                <p>
                    Priority:
                    <span class="priority-${task.priority.toLowerCase()}">
                        ${task.priority}
                    </span>
                </p>
                <p>Due Date: ${task.dueDate}</p>
                <p>Status: ${task.status}</p>
                <div class="task-actions">
                    <button onclick="toggleStatus(${task.id})">
                        ${task.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}
                    </button>
                    <button onclick="editTask(${task.id})">Edit</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
            tasksContainer.appendChild(taskCard);
        });
    }
}

// Add or update task
taskForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;

    if (!title || !priority || !dueDate) {
        alert('Please fill in all required fields.');
        return;
    }

    // Due date validation
    if (new Date(dueDate) < new Date().setHours(0, 0, 0, 0)) {
        alert('Due date cannot be in the past.');
        return;
    }

    if (editId) {
        // Update existing task
        const task = tasks.find(t => t.id === editId);
        task.title = title;
        task.description = description;
        task.priority = priority;
        task.dueDate = dueDate;
        editId = null;
        submitBtn.textContent = 'Add Task';
    } else {
        // Add new task
        const newTask = {
            id: Date.now(),
            title,
            description,
            priority,
            dueDate,
            status: 'pending'
        };
        tasks.push(newTask);
    }

    saveTasks();
    renderTasks();
    taskForm.reset();
});

// Toggle task status
function toggleStatus(id) {
    const task = tasks.find(t => t.id === id);
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    saveTasks();
    renderTasks();
}

// Edit task
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    titleInput.value = task.title;
    descriptionInput.value = task.description;
    prioritySelect.value = task.priority;
    dueDateInput.value = task.dueDate;
    editId = id;
    submitBtn.textContent = 'Update Task';
}

// Delete task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }
}

// Filter event listeners
statusFilter.addEventListener('change', renderTasks);
priorityFilter.addEventListener('change', renderTasks);

// Initialize
loadTasks();
