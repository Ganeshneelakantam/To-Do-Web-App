document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

function addTask() {
    const titleInput = document.getElementById('new-task-title');
    const descInput = document.getElementById('new-task-desc');
    const title = titleInput.value.trim();
    const desc = descInput.value.trim();
    if (title && desc) {
        const task = {
            id: Date.now(),
            title: title,
            description: desc,
            completed: false,
        };
        saveTask(task);
        titleInput.value = '';
        descInput.value = '';
    }
}

function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function loadTasks() {
    renderTasks();
}

function renderTasks() {
    const tasks = getTasks();
    const pendingTasks = document.getElementById('pending-tasks');
    const completedTasks = document.getElementById('completed-tasks');

    pendingTasks.innerHTML = '';
    completedTasks.innerHTML = '';

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.setAttribute('data-id', task.id);
        
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        taskContent.innerHTML = `<strong>${task.title}</strong><p>${task.description}</p>`;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.classList.add('delete');
        deleteButton.onclick = () => confirmDeleteTask(task.id);

        if (task.completed) {
            taskContent.classList.add('completed');
            taskItem.appendChild(taskContent);
            taskItem.appendChild(deleteButton);
            completedTasks.appendChild(taskItem);
        } else {
            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.classList.add('complete');
            completeButton.onclick = () => toggleComplete(task.id);

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit');
            editButton.onclick = () => editTask(task.id);

            taskItem.appendChild(taskContent);
            taskItem.appendChild(completeButton);
            taskItem.appendChild(editButton);
            taskItem.appendChild(deleteButton);
            pendingTasks.appendChild(taskItem);
        }
    });
}

function confirmDeleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        deleteTask(taskId);
    }
}

function toggleComplete(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
}

function editTask(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const newTitle = prompt('Enter new title:', task.title);
        const newDesc = prompt('Enter new description:', task.description);
        if (newTitle !== null && newDesc !== null) {
            task.title = newTitle.trim();
            task.description = newDesc.trim();
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        }
    }
}

function deleteTask(taskId) {
    let tasks = getTasks();
    tasks = tasks.filter(t => t.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}
