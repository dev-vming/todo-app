const todoList = document.getElementById("todo-list");

function createTodo(todoData) {
  const { title, completed } = todoData;
  const li = document.createElement("li");
  li.className = "todo";
  li.style.listStyle = "none";
  if (completed) li.classList.add("completed");
  li.innerHTML = `
            <input type="checkbox" ${completed ? "checked" : ""}/>
            <span class="title">${title}</span>
            <input class="todo-edit-input" type="text"/>
            <button class="del">삭제</button>`;
  document.getElementById("todo-list").appendChild(li);
}

// 1. 할 일 등록, 2. 할 일 목록 표시 - 엔터 키를 눌렀을 때, 할 일이 목록으로 표시되는 기능
document.getElementById("todo-input").addEventListener("keydown", (event) => {
  if (event.isComposing) return;
  if (event.key === "Enter") {
    const title = event.target.value;
    const todoData = { title, completed: false };
    createTodo(todoData);
    event.target.value = "";
    updateRemainingTodos();
    saveTodos();
  }
});

// 3. 할 일 완료 - 할 일의 완료 상태를 표시 및 변경할 수 있는 기능
todoList.addEventListener("click", (event) => {
  if (event.target.tagName === "INPUT" && event.target.type === "checkbox") {
    const todo = event.target.closest(".todo");
    todo.classList.toggle("completed");
    const checkbox = todo.querySelector("input[type='checkbox']");
    checkbox.checkes = todo.classList.contains("completed");
    updateRemainingTodos();
    saveTodos();
  }
});

// 4. 할 일 개수 표시 - 전체 및 남아있는 할 일의 개수를 표시하는 기능
function updateRemainingTodos() {
  const num_remaining_todos = document.querySelectorAll(
    ".todo:not(.completed)"
  ).length;
  document.getElementById("num-remaining-todos").innerText =
    num_remaining_todos;
}

// 5. 할 일 삭제 - 목록에서 특정 할 일을 삭제하는 기능
todoList.addEventListener("click", (event) => {
  const button = event.target.closest("button.del");
  if (button) {
    const todo = button.closest(".todo");
    todo.remove();
    updateRemainingTodos();
    saveTodos();
  }
});

// 6.할 일 수정 - 이미 입력된 할 일의 내용을 수정하는 기능
todoList.addEventListener("dblclick", (event) => {
  const title = event.target.closest("span.title");
  if (title) {
    const todo = title.closest(".todo");
    todo.classList.add("editing");
    const input = todo.querySelector("input.todo-edit-input");
    input.value = title.innerText;
    input.focus();
  }
});

todoList.addEventListener("keydown", (event) => {
  const input = event.target.closest("input.todo-edit-input");
  if (input) {
    if (event.isComposing) return;
    if (event.key === "Enter") {
      const todo = input.closest(".todo");
      const title = todo.querySelector("span.title");
      title.innerText = input.value;
      todo.classList.remove("editing");
      saveTodos();
    }
  }
});

todoList.addEventListener(
  "blur",
  (event) => {
    const input = event.target.closest("input.todo-edit-input");
    if (input) {
      const todo = input.closest(".todo");
      todo.classList.remove("editing");
    }
  },
  true
);

// 7. 할 일 필터링 - 완료된 할 일과 진행 중인 할 일을 구분하여 볼 수 있는 필터 기능
const filterStatus = ["all", "active", "completed"];

filterStatus.map((status) => {
  document
    .getElementById(`btn-show-${status}`)
    .addEventListener("click", (event) => {
      todoList.setAttribute("data-filter", status);
    });
});

// 8. 할 일 일괄 완료 처리 - 모든 할 일을 한 번에 완료 처리할 수 있는 기능
document.getElementById("btn-toggle-all").addEventListener("click", (event) => {
  const isAllChecked = [...todoList.querySelectorAll(".todo")].every((todo) =>
    todo.classList.contains("completed")
  );
  todoList.querySelectorAll(".todo").forEach((todo) => {
    if (isAllChecked) {
      todo.classList.remove("completed");
      const checkbox = todo.querySelector("input[type='checkbox']");
      checkbox.checked = false;
    } else {
      todo.classList.add("completed");
      const checkbox = todo.querySelector("input[type='checkbox']");
      checkbox.checked = true;
    }
    updateRemainingTodos();
    saveTodos();
  });
});

// 9. 할 일 일괄 삭제 - 완료된 할 일만을 선택적으로 일괄 삭제하는 기능
document
  .getElementById("btn-clear-completed")
  .addEventListener("click", (event) => {
    todoList.querySelectorAll(".todo.completed").forEach((todo) => {
      todo.remove();
    });
    updateRemainingTodos();
    saveTodos();
  });

// 10. 지속성 - 데이터를 지속적으로 저장하며, 웹 페이지 새로고침 후에도 할 일 목록을 유지하는 기능
function saveTodos() {
  // 직렬화
  const savedTodos = [...todoList.querySelectorAll(".todo")].map((todo) => {
    const title = todo.querySelector("span.title").innerText;
    const completed = todo.classList.contains("completed");

    return { title, completed };
  });
  localStorage.setItem("todos", JSON.stringify(savedTodos));
}

const savedTodos = JSON.parse(localStorage.getItem("todos") || "[]");

// 역직렬화
savedTodos.forEach((todoData) => {
  createTodo(todoData);
});

updateRemainingTodos();
