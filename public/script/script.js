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
// add dragged item to container above element
containers.forEach((container) => {
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
      container.appendChild(draggable);
    } else container.insertBefore(draggable, afterElement);
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
