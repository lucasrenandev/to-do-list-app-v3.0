"use strict";

const input = document.querySelector(".to-do-list .input-field input");
const button = document.querySelector(".to-do-list .input-field button");
const errorText = document.querySelector(".to-do-list .error-text");
const taskList = document.querySelector(".to-do-list .task-list");

errorText.textContent = "Please, add a task!";

function displayError() {
    errorText.classList.add("error");
    setTimeout(() => {
        errorText.classList.remove("error");
    }, 2000);
}

function createTask() {
    const list = document.createElement("li");
    const pencil = document.createElement("span");
    const trash = document.createElement("span");
    const editBox = document.createElement("div");
    const editingElement = document.createElement("input");

    list.classList.add("list");
    list.textContent = input.value;

    editBox.classList.add("edit-box");
    editingElement.type = "text";

    pencil.innerHTML = `\uf044`;
    pencil.classList.add("pencil");
    pencil.title = "Edit task";

    trash.innerHTML = `\uf1f8`;
    trash.classList.add("trash");
    trash.title = "Delete task";
    
    editBox.appendChild(editingElement);
    list.append(editBox, pencil, trash);
    taskList.appendChild(list);
}

function addTask() {
    if(input.value ? createTask() : displayError());
    input.value = "";
    saveTaskToLocalStorage();
}

function editTask(event) {
    const list = event.target.parentElement;
    const editBox = list.querySelector(".edit-box");
    const editElement = list.querySelector(".edit-box input");
    const pencil = list.querySelector(".pencil");
    const trash = list.querySelector(".trash");

    const editTask = (event) => {
        if(event.code === "Enter") {
            if(editElement.value) {
                list.textContent = editElement.value;
                editBox.appendChild(editElement);
                list.append(editBox, pencil, trash);
            }
            editBox.classList.remove("open");
            editElement.value = "";
            editElement.click();
        }
    }
    if(!editBox.classList.contains("open")) {
        editBox.classList.add("open");
        editElement.value = list.textContent.slice(0, -2);
        editElement.addEventListener("keydown", editTask);
    }
    else {
        editBox.classList.remove("open");
        editElement.removeEventListener("keydown", editTask);
    }
}

function saveTaskToLocalStorage() {
    localStorage.setItem("task", taskList.innerHTML);
}

function saveTaskInDocument() {
    taskList.innerHTML = localStorage.getItem("task");
}

input.addEventListener("keydown", function(event) {
    if(event.code === "Enter") {
        addTask();
        this.click();
    }
});

taskList.addEventListener("click", function(event) {
    const tagClass = event.target.className;
    if(tagClass === "list") {
        event.target.classList.add("completed");
    }
    else if(tagClass === "list completed") {
        event.target.classList.remove("completed");
    }
    else if(tagClass === "trash") {
        event.target.parentElement.remove();
    }
    else if(tagClass === "pencil") {
        editTask(event);
    }
    saveTaskToLocalStorage();
});


window.addEventListener("load", function() {
    let isPageReloaded = false;
    if(!isPageReloaded) {
        const editBoxs = this.document.querySelectorAll(".edit-box");
        editBoxs.forEach((box) => {
            box.classList.remove("open");
            isPageReloaded = true;
        });
    }
});

saveTaskInDocument();
button.addEventListener("click", addTask);