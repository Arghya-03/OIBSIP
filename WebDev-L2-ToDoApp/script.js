const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const taskCount = document.getElementById("taskCount");

const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("taskFlowTasks")) || [];

let currentFilter = "all";


// Add a new task

addTaskButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        addTask();
    }

});


function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();

    taskInput.focus();
}


// Display tasks

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {

        filteredTasks = tasks.filter(function (task) {
            return !task.completed;
        });

    }

    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(function (task) {
            return task.completed;
        });

    }


    filteredTasks.forEach(function (task) {

        const taskItem = document.createElement("li");

        taskItem.className = "task-item";

        if (task.completed) {
            taskItem.classList.add("completed");
        }


        // Checkbox

        const checkbox = document.createElement("button");

        checkbox.className = "task-checkbox";

        checkbox.setAttribute(
            "aria-label",
            "Mark task as completed"
        );

        checkbox.addEventListener("click", function () {
            toggleTask(task.id);
        });


        // Task text

        const taskText = document.createElement("span");

        taskText.className = "task-text";

        taskText.textContent = task.text;


        // Action container

        const actions = document.createElement("div");

        actions.className = "task-actions";


        // Edit button

        const editButton = document.createElement("button");

        editButton.className = "task-action";

        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            editTask(task.id);
        });


        // Delete button

        const deleteButton = document.createElement("button");

        deleteButton.className = "task-action delete";

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });


        actions.appendChild(editButton);
        actions.appendChild(deleteButton);


        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(actions);


        taskList.appendChild(taskItem);

    });


    updateTaskCount(filteredTasks);

    updateEmptyMessage(filteredTasks);

}


// Complete / uncomplete task

function toggleTask(id) {

    tasks = tasks.map(function (task) {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;

    });

    saveTasks();

    renderTasks();
}


// Delete task

function deleteTask(id) {

    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });

    saveTasks();

    renderTasks();
}


// Edit task

function editTask(id) {

    const task = tasks.find(function (task) {
        return task.id === id;
    });

    if (!task) {
        return;
    }

    const newText = prompt(
        "Edit your task:",
        task.text
    );

    if (newText === null) {
        return;
    }

    const updatedText = newText.trim();

    if (updatedText === "") {
        alert("Task cannot be empty.");
        return;
    }


    tasks = tasks.map(function (task) {

        if (task.id === id) {

            return {
                ...task,
                text: updatedText
            };

        }

        return task;

    });

    saveTasks();

    renderTasks();
}


// Filters

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();

    });

});


// Task count

function updateTaskCount(filteredTasks) {

    const count = filteredTasks.length;

    if (count === 1) {
        taskCount.textContent = "1 task";
    } else {
        taskCount.textContent = count + " tasks";
    }

}


// Empty message

function updateEmptyMessage(filteredTasks) {

    if (filteredTasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

}


// Save tasks to browser

function saveTasks() {

    localStorage.setItem(
        "taskFlowTasks",
        JSON.stringify(tasks)
    );

}


// Load tasks when page opens

renderTasks();