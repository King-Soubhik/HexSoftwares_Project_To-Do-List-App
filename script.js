const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("AlertMessage");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("AddUpdateClick");

let todo = JSON.parse(localStorage.getItem("todo-list")) || [];

function setAlertMessage(message) {
  todoAlert.removeAttribute("class");
  todoAlert.innerText = message;

  setTimeout(() => {
    todoAlert.classList.add("toggleMe");
  }, 1000);
}

function CreateToDoItems() {
  if (todoValue.value === "") {
    setAlertMessage("Please enter your todo text!");
    todoValue.focus();
    return;
  }

  let IsPresent = todo.some(element => element.item === todoValue.value);

  if (IsPresent) {
    setAlertMessage("This task is already present in the list!");
    return;
  }

  let li = document.createElement("li");
  const todoItems = `<div title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${todoValue.value}</div>
                     <div>
                       <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="pencil.png" />
                       <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="delete.png" />
                     </div>`;
  li.innerHTML = todoItems;
  listItems.appendChild(li);

  todo.push({ item: todoValue.value, status: false });
  setLocalStorage();
  todoValue.value = "";
  setAlertMessage("New Task Added Successfully!");
}

function ReadToDoItems() {
  listItems.innerHTML = ""; // Clear existing items
  todo.forEach((element) => {
    let li = document.createElement("li");
    let style = element.status ? "style='text-decoration: line-through'" : "";
    const todoItems = `<div ${style} title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">
                        ${element.item}
                        ${element.status ? '<img class="todo-controls" src="check-mark.png" />' : ""}
                       </div>
                       <div>
                         ${element.status ? "" : '<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="pencil.png" />'}
                         <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="delete.png" />
                       </div>`;
    li.innerHTML = todoItems;
    listItems.appendChild(li);
  });
}
ReadToDoItems();

function UpdateToDoItems(e) {
  const div = e.parentElement.parentElement.querySelector("div");
  if (div.style.textDecoration.trim() === "") {
    todoValue.value = div.innerText.trim();
    updateText = div;
    addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()");
    addUpdate.setAttribute("src", "refresh.png");
    todoValue.focus();
  }
}

function UpdateOnSelectionItems() {
  let IsPresent = todo.some(element => element.item === todoValue.value);

  if (IsPresent) {
    setAlertMessage("This task is already present in the list!");
    return;
  }

  todo.forEach((element) => {
    if (element.item === updateText.innerText.trim()) {
      element.item = todoValue.value;
    }
  });
  setLocalStorage();

  updateText.innerText = todoValue.value;
  addUpdate.setAttribute("onclick", "CreateToDoItems()");
  addUpdate.setAttribute("src", "plus.png");
  todoValue.value = "";
  setAlertMessage("Task Updated Successfully!");
}

function DeleteToDoItems(e) {
  let deleteValue = e.parentElement.parentElement.querySelector("div").innerText.trim();

  if (confirm(`This action will permanently remove the task "${deleteValue}" from your To-Do List and Local Storage ! Press OK to continue, or Cancel to discard the changes. `)) {
    e.parentElement.parentElement.setAttribute("class", "deleted-item");
    todoValue.focus();

    todo = todo.filter(element => element.item.trim() !== deleteValue);
    setAlertMessage("Todo item Deleted Successfully!");
    setLocalStorage();
  }
}

function CompletedToDoItems(e) {
  if (e.parentElement.querySelector("div").style.textDecoration.trim() === "") {
    const img = document.createElement("img");
    img.src = "check-mark.png";
    img.className = "todo-controls";
    e.parentElement.querySelector("div").style.textDecoration = "line-through";
    e.parentElement.querySelector("div").appendChild(img);
    e.parentElement.querySelector("img.edit").remove();

    todo.forEach((element) => {
      if (e.parentElement.querySelector("div").innerText.trim() === element.item) {
        element.status = true;
      }
    });
    setLocalStorage();
    setAlertMessage("Task Completed Successfully!");
  }
}

function setLocalStorage() {
  localStorage.setItem("todo-list", JSON.stringify(todo));
}
