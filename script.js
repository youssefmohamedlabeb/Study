let title = document.getElementById("title");
let taskInput = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let message = document.getElementById("message");
let taskCount = document.getElementById("taskCount");
let taskList = document.getElementById("taskList");
let count = 0;

// 1. استرجاع البيانات المخزنة فور تحميل الصفحة
document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);

addBtn.addEventListener("click", function() {
  let taskText = taskInput.value.trim();
  if(taskText === "") {
    message.textContent = "Please Enter New Task";
    return;
  }

  // إضافة المهمة للشاشة
  createTaskUI(taskText, "");

  // حفظ المهمة في الذاكرة
  saveTaskToLocalStorage(taskText, "");

  message.textContent = "Task Added Successfully";
  taskInput.value = "";
});

// دالة لإنشاء عناصر المهمة وعرضها في الصفحة
function createTaskUI(taskText, noteText = "") {
  let li = document.createElement("li");
  let taskSpan = document.createElement("span");
  taskSpan.textContent = taskText;

  let noteInput = document.createElement("input");
  noteInput.type = "text";
  noteInput.placeholder = "Add a note";
  noteInput.value = noteText;

  // حفظ التحديث على الملاحظة فور كتابتها في الذاكرة
  noteInput.addEventListener("input", function () {
    updateNoteInLocalStorage(taskText, noteInput.value);
  });

  let deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", function () {
    li.remove();
    count--;
    taskCount.textContent = count;
    message.textContent = "Task Deleted";

    // حذف المهمة من الذاكرة
    removeTaskFromLocalStorage(taskText);
  });

  li.appendChild(taskSpan);
  li.appendChild(noteInput);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);

  // تحديث العداد
  count++;
  taskCount.textContent = count;
}

// === وظائف التعامل مع LocalStorage ===

// 1. الحصول على قائمة المهام من الذاكرة
function getTasksFromLocalStorage() {
  let tasks = localStorage.getItem("myTasks");
  return tasks ? JSON.parse(tasks) : [];
}

// 2. حفظ مهمة جديدة
function saveTaskToLocalStorage(taskText, noteText) {
  let tasks = getTasksFromLocalStorage();
  tasks.push({ text: taskText, note: noteText });
  localStorage.setItem("myTasks", JSON.stringify(tasks));
}

// 3. استرجاع جميع المهام عند تحميل الصفحة
function loadTasksFromLocalStorage() {
  let tasks = getTasksFromLocalStorage();
  tasks.forEach(task => {
    createTaskUI(task.text, task.note);
  });
}

// 4. حذف مهمة من الذاكرة
function removeTaskFromLocalStorage(taskText) {
  let tasks = getTasksFromLocalStorage();
  tasks = tasks.filter(task => task.text !== taskText);
  localStorage.setItem("myTasks", JSON.stringify(tasks));
}

// 5. تحديث الملاحظة في الذاكرة عند التعديل عليها
function updateNoteInLocalStorage(taskText, newNote) {
  let tasks = getTasksFromLocalStorage();
  let task = tasks.find(t => t.text === taskText);
  if (task) {
    task.note = newNote;
    localStorage.setItem("myTasks", JSON.stringify(tasks));
  }
}
