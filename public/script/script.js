// // drop and drag feature
const draggables = document.querySelectorAll(".draggable");
const containers = document.querySelectorAll(".container");
// add and remove class on dragging item
draggables.forEach((draggable) => {
  draggable.addEventListener("dragstart", () => {
    draggable.classList.add("dragging");
  });
  draggable.addEventListener("dragend", () => {
    draggable.classList.remove("dragging");
  });
});
// add dragged item to container below or above element
containers.forEach((container) => {
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
      container.appendChild(draggable);
      rebuildArrays();
    } else container.insertBefore(draggable, afterElement);
    rebuildArrays();
  });
});
// find position of dragged element in relation to other elements
function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    {
      offset: Number.NEGATIVE_INFINITY,
    }
  ).element;
}

// get column groups
const groupColumns = document.querySelectorAll(".container");
const ideasGroup = document.getElementById("ideas-group");
const todoGroup = document.getElementById("todo-group");
const doingGroup = document.getElementById("doing-group");
const doneGroup = document.getElementById("done-group");
const followUpGroup = document.getElementById("follow-up-group");

// items
let updatedOnLoad = false;

// initialize arrays
let ideasGroupArray = [];
let todoGroupArray = [];
let doingGroupArray = [];
let doneGroupArray = [];
let followUpGroupArray = [];
let groupArrays = [];

// get arrays from localStorage if available, set default values if not
// change to db when working here
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    ideasGroupArray = JSON.parse(localStorage.ideasItems);
    todoGroupArray = JSON.parse(localStorage.todoItems);
    doingGroupArray = JSON.parse(localStorage.doingItems);
    doneGroupArray = JSON.parse(localStorage.doneItems);
    followUpGroupArray = JSON.parse(localStorage.followUpItems);
  } else {
    ideasGroupArray = ["read Proust", "listen to Giant Steps"];
    todoGroupArray = ["record bass parts", "buy a triangle"];
    doingGroupArray = ["make a cigar box guitar", "e-bowing the letter"];
    doneGroupArray = ["all drums recorded", "sang to the plants"];
    followUpGroupArray = ["find out what you like", "let it love you"];
  }
}
// set localStorage arrays - again, this will be databse
function updateSavedColumns() {
  groupArrays = [
    ideasGroupArray,
    todoGroupArray,
    doingGroupArray,
    doneGroupArray,
    followUpGroupArray,
  ];
  const arrayNames = ["ideas", "todo", "doing", "done", "followUp"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(groupArrays[index])
    );
  });
}
// filter array to remove empty values
function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

// creat DOM elements for each item
function createItem(columnElement, column, item, index) {
  const groupElement = document.createElement("div");
  groupElement.classList.add("note-container", "draggable");

  const inputElement = document.createElement("input");
  inputElement.classList.add("edit", "draggable");
  inputElement.value = item;
  inputElement.id = `${column}${index}`;
  inputElement.draggable = true;

  const anchor = document.createElement("a");
  anchor.href = "#";

  const span = document.createElement("span");
  span.classList.add("delete-btn");
  span.innerText = "X";
  span.setAttribute("onclick", "deleteItem()");
  span.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  // append to group
  columnElement.appendChild(groupElement);
  groupElement.appendChild(inputElement);
  groupElement.appendChild(anchor);
  anchor.appendChild(span);
}

// update columns in DOM - reset HTML, filter array, update localStorage

function updateDOM() {
  // check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  //  ideas column
  ideasGroupArray.forEach((ideasItem, index) => {
    createItem(ideasGroup, 0, ideasItem, index);
  });
  ideasGroupArray = filterArray(ideasGroupArray);
  //  todo column
  todoGroupArray.forEach((todoItem, index) => {
    createItem(todoGroup, 1, todoItem, index);
  });
  todoGroupArray = filterArray(todoGroupArray);
  //  doing column
  doingGroupArray.forEach((doingItem, index) => {
    createItem(doingGroup, 2, doingItem, index);
  });
  doingGroupArray = filterArray(doingGroupArray);
  //  done column
  doneGroupArray.forEach((doneItem, index) => {
    createItem(doneGroup, 3, doneItem, index);
  });
  doneGroupArray = filterArray(doneGroupArray);
  //  followUp column
  followUpGroupArray.forEach((followUpItem, index) => {
    createItem(followUpGroup, 4, followUpItem, index);
  });
  followUpGroupArray = filterArray(followUpGroupArray);

  updatedOnLoad = true;
  updateSavedColumns();
}

// update item - delete if necessary, or update array value
function updateItem(id, column) {
  const selectedArray = groupArrays[column];
  const selectedColumn = groupColumns[column].children;
  if (!draggable) {
    if (!selectedColumn[id].value) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumn[id].value;
    }
    updateDOM();
  }
}

// allows arrays to reflect drag and drop items
function rebuildArrays() {
  ideasGroupArray = [];
  for (let i = 0; i < ideasGroup.children.length; i++) {
    ideasGroupArray.push(ideasGroup.children[i].value);
  }
  todoGroupArray = [];
  for (let i = 0; i < todoGroup.children.length; i++) {
    todoGroupArray.push(todoGroup.children[i].value);
  }
  doingGroupArray = [];
  for (let i = 0; i < doingGroup.children.length; i++) {
    doingGroupArray.push(doingGroup.children[i].value);
  }
  doneGroupArray = [];
  for (let i = 0; i < doneGroup.children.length; i++) {
    doneGroupArray.push(doneGroup.children[i].value);
  }
  updateDOM();
}

// add-new and save functions

// get add-new and save buttons
const addNew = document.querySelectorAll(".add-new:not(.solid)");
const saveItem = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");

// add/save/hide new item box
function showInputBox(column) {
  addNew[column].style.visibility = "hidden";
  saveItem[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
  addItems[column].focus();
}

function hideInputBox(column) {
  addNew[column].style.visibility = "visible";
  saveItem[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}

// add to column list, reset input
function addToColumn(column) {
  const itemText = addItems[column].value;
  const selectedArray = groupArrays[column];
  selectedArray.push(itemText);
  console.log(itemText);
  console.log(selectedArray);
  // reset
  addItems[column].value = "";
  updateDOM(column);
}

// delete item function - each input box needs individual id and this function needs to target that
function deleteItem() {
  let deleteItem = document.getElementById("id");
  deleteItem.remove();
}

// modal

// access buttons and modal
const buttonOpen = document.getElementById("button-open");
const buttonClose = document.getElementById("button-close");
const modal = document.getElementById("modal-container-id");

// close modal and reset form
buttonOpen.addEventListener("click", function (e) {
  // prevent the form from submitting
  e.preventDefault();
  modal.style.visibility = "visible";
  buttonOpen.style.visibility = "hidden";
});

// close modal and reset form
buttonClose.onclick = () => {
  modal.style.visibility = "hidden";
  buttonOpen.style.visibility = "visible";
};

// on load
updateDOM();
