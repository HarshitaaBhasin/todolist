// script2.js

const taskList = document.querySelector(".tasklist");
const addTaskButton = document.querySelector(".addbtn");
const searchButton = document.querySelector(".searchbtn");
const sortByDropdown = document.querySelector(".sortby");
const searchInput = document.querySelector(".search");
const titleInput = document.querySelector(".title");
const dateInput = document.querySelector(".date");
const descriptionInput = document.querySelector(".description");
const categoryInput = document.querySelector(".category");

// Initialize tasks from local storage or an empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render tasks from the tasks array
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    taskDiv.innerHTML = `
      <div class="marktask"><input type="checkbox" onchange="changeStatus(${index})" ${task.completed ? "checked" : ""}></div>
      <div class="titletask">${task.title}</div>
      <div class="descriptiontask">${task.description}</div>
      <div class="duedatetask">${task.dueDate}</div>
      <div class="status">${task.completed ? "Completed" : "Pending"}</div>
      <div class="edit"><button class="edit-button" onclick="editTask(${index})">Edit</button></div>
      <div class="delete"><button class="delete-button" onclick="deleteTask(${index})">Delete</button></div>
    `;

    taskList.appendChild(taskDiv);



    // Add CSS styles to make description scrollable
    const descriptionDiv = taskDiv.querySelector(".descriptiontask");
    descriptionDiv.style.overflow = "auto";
    descriptionDiv.style.maxHeight = "50px"; // Set 
  });
}


// Add a new task
function addTask() {
    if (!titleInput.value || !dateInput.value || !descriptionInput.value || !categoryInput.value) {
        alert("Please fill in all the details before adding a task.");
        return;
      }
    
  const newTask = {
    title: titleInput.value,
    dueDate: dateInput.value,
    description: descriptionInput.value,
    category: categoryInput.value,
    completed: false,
  };

  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  categoryInput.value = "";

renderTasks();
}


function sortTasks() {
    const sortBy = sortByDropdown.value;
  
    if (sortBy === "duedate") {
      tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === "status") {
      tasks.sort((a, b) => {
        if (a.completed === b.completed) {
          // If both tasks have the same completion status,
          // sort them by due date.
          return new Date(a.dueDate) - new Date(b.dueDate);
        } else {
          // Sort completed tasks to the bottom.
          return a.completed ? 1 : -1;
        }
      });
    } else if (sortBy === "category") {
     
        tasks.sort((a, b) => {
            // Define the order of categories
            const categoryOrder = ["personal", "work", "shopping"];
            
            // Get the index of each task's category in the order array
            const indexA = categoryOrder.indexOf(a.category);
            const indexB = categoryOrder.indexOf(b.category);
            
            // Compare the indices to determine the order
            if (indexA === indexB) {
              // If categories are the same, sort by due date
              return new Date(a.dueDate) - new Date(b.dueDate);
            } else {
              // Sort by the category order
              return indexA - indexB;
            }
        });
    }
  
    renderTasks();
  }
  

// Change task status
function changeStatus(index) {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Initial rendering of tasks
dateInput.addEventListener("change", function () {
    const selectedDate = dateInput.value;
    renderSelectedDueDate(selectedDate);
  });
  
  function renderSelectedDueDate(selectedDate) {
    const dueDateDisplay = document.querySelector(".selected-due-date");
    dueDateDisplay.textContent = `Selected Due Date: ${selectedDate}`;
  }
  
  renderTasks();

// Search tasks
function searchTasks() {
  const searchText = searchInput.value.toLowerCase();

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchText)
  );
//  filtered tasks
    renderFilteredTasks(filteredTasks);

}

function renderFilteredTasks(filteredTasks){
    taskList.innerHTML="";
    filteredTasks.forEach((task,index) => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        taskDiv.innerHTML = `
          <div class="marktask"><input type="checkbox" onchange="changeStatus(${index})" ${task.completed ? "checked" : ""}></div>
          <div class="titletask">${task.title}</div>
          <div class="descriptiontask">${task.description}</div>
          <div class="duedatetask">${task.dueDate}</div>
          <div class="status">${task.completed ? "Completed" : "Pending"}</div>
          <div class="edit"><button class="edit-button" onclick="editTask(${index})">Edit</button></div>
          <div class="delete"><button class="delete-button" onclick="deleteTask(${index})">Delete</button></div>
        `;
    
        taskList.appendChild(taskDiv);
      });
}


// Edit task
function editTask(index) {
    const taskToEdit = tasks[index];
    
    // Create a form for editing the task
    const editForm = document.createElement("div");
    editForm.innerHTML = `
      <input type="text" class="edit-title" value="${taskToEdit.title}">
      <input type="date" class="edit-date" value="${taskToEdit.dueDate}">
      <input type="text" class="edit-description" value="${taskToEdit.description}">
      <button class="save-button" onclick="saveTask(${index})">Save</button>
      <button class="cancel-button" onclick="cancelEdit(${index})">Cancel</button>
    `;
  
    // Replace the task's content with the edit form
    const taskDiv = taskList.querySelector(".task:nth-child(" + (index + 1) + ")");
    taskDiv.innerHTML = "";
    taskDiv.appendChild(editForm);
  }
  
  // Cancel editing task
  function cancelEdit(index) {
    renderTasks(); // Simply re-render the tasks to cancel editing
  }
  
  
  // Save edited task
  function saveTask(index) {
    const updatedTitle = document.querySelector(".edit-title").value;
    const updatedDate = document.querySelector(".edit-date").value;
    const updatedDescription = document.querySelector(".edit-description").value;
  
    tasks[index].title = updatedTitle;
    tasks[index].dueDate = updatedDate;
    tasks[index].description = updatedDescription;
  
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }

+
  // Delete task
function deleteTask(index) {
    if (confirm("Are you sure you want to delete this task?")) {
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    }
  }
  

addTaskButton.addEventListener("click", addTask);
searchButton.addEventListener("click", searchTasks);
sortByDropdown.addEventListener("change", sortTasks);

// Initial rendering of tasks
renderTasks();





  // Initialize tasks data in local storage (for each user)
  function initializeTasks(username) {
    if (!localStorage.getItem(username)) {
      localStorage.setItem(username, JSON.stringify([]));
    }
  }
  
  // Function to handle user signup
  function signup() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
  
    // Check if the username is unique
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.some(user => user.username === username)) {
      alert('Username already exists. Please choose a different one.');
      return;
    }
  
    // Create a new user and store it in local storage
    const newUser = { username, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
  // Initialize tasks for the user in local storage
  localStorage.setItem(username, JSON.stringify([])); // Create an empty task list for the user

    // initializeTasks(username);
  
    // Clear the signup form fields
    document.getElementById('signup-username').value = '';
    document.getElementById('signup-password').value = '';
  
    alert('Signup successful. Please log in.');
  }
  
  // Function to handle user login
  function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
  
    // Check if the username and password match a user in local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.password === password);
  
    if (user) {
      // Successful login
      alert('Login successful.');
              // Hide login and signup forms, show the task manager section
      document.querySelector('.login-form').style.display = 'none';
      document.querySelector('.signup-form').style.display = 'none';
      document.querySelector('.task-manager').style.display = 'block';

    
    loadUserTasks(username);
          // Implement code to show the task manager interface and tasks for the logged-in user.
    } else {
      // Failed login
      alert('Invalid username or password. Please try again.');
    }
  
    // Clear the login form fields
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
  }
  function loadUserTasks(username) {
    tasks = JSON.parse(localStorage.getItem(username)) || [];
    renderTasks();
  }