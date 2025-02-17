// 주요 관전 포인트
// 1. 어떻게 구현사항이 구조화 되는가?
// 2. DOM API 대신 data-bind 개념으로 개발하는 방식 이해하기
// 3. Model과 View 그리고 ViewModel의 의미 파악하기

class ViewModel {
  constructor() {
    // Model
    const savedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
    // 1. 할 일 목록 생성 - 사용자가 새로운 할 일을 입력할 수 있게 하는 기능
    this.todos = ko.observableArray(savedTodos);

    // 4. 할 일 개수 표시 - 전체 및 남아있는 할 일의 개수를 표시하는 기능
    this.num_remaining_todos = ko.computed(() => {
      return this.todos().filter((todo) => !todo.completed).length;
    });

    // 6.할 일 수정 - 이미 입력된 할 일의 내용을 수정하는 기능
    this.editingTodo = ko.observable(null);
    this.editingTitle = ko.observable("");

    // 7. 할 일 필터링 - 완료된 할 일과 진행 중인 할 일을 구분하여 볼 수 있는 필터 기능
    this.visiblilityFilter = ko.observable("ALL");
    this.activeButton = ko.observable("ALL");

    this.filteredTodos = ko.computed(() => {
      switch (this.visiblilityFilter()) {
        case "ALL":
          return this.todos();
        case "ACTIVE":
          return this.todos().filter((todo) => !todo.completed);
        case "COMPLETED":
          return this.todos().filter((todo) => todo.completed);
      }
    }); 

    // 10. 지속성 - 데이터를 지속적으로 저장하며, 웹 페이지 새로고침 후에도 할 일 목록을 유지하는 기능
    ko.computed(() => {
      localStorage.setItem("todos", JSON.stringify(this.todos()));
    });

  }

  // 1. 할 일 등록, 2. 할 일 목록 표시 - 엔터 키를 눌렀을 때, 할 일이 목록으로 표시되는 기능
  할일추가(viewModel, event) {
    if (event.originalEvent.isComposing) return true;
    if (event.key !== "Enter") return true;

    const title = event.target.value;
    this.todos.push({ title, completed: false });

    event.target.value = "";
    return true;
  }

  // 3. 할 일 완료 - 할 일의 완료 상태를 표시 및 변경할 수 있는 기능
  할일완료토글(todo) {
    this.todos.replace(todo, { ...todo, completed: !todo.completed });
  }

  // 5. 할 일 삭제 - 목록에서 특정 할 일을 삭제하는 기능
  할일삭제(todo) {
    this.todos.remove(todo);
  }

  // 6.할 일 수정 - 이미 입력된 할 일의 내용을 수정하는 기능
  할일수정(todo) {
    this.editingTodo(todo);
    this.editingTitle(todo.title);
  };

  할일제목수정(todo, event) {
    if (event.originalEvent.isComposing) return true;
    if (event.key !== "Enter") return true;
    this.todos.replace(todo, { ...todo, title: this.editingTitle() });
    this.editingTodo(null);
    this.editingTitle("");
  };

  할일수정취소() {
    this.editingTodo(null);
    this.editingTitle("");
  };

  // 7. 할 일 필터링 - 완료된 할 일과 진행 중인 할 일을 구분하여 볼 수 있는 필터 기능
  전체보기() {
    this.visiblilityFilter("ALL");
    this.activeButton("ALL");
  };

  해야할일보기() {
    this.visiblilityFilter("ACTIVE");
    this.activeButton("ACTIVE");
  };

  완료한일보기() {
    this.visiblilityFilter("COMPLETED");
    this.activeButton("COMPLETED");
  };

  // 8. 할 일 일괄 완료 처리 - 모든 할 일을 한 번에 완료 처리할 수 있는 기능
  전체완료토글() {
    const isAllCompleted = this.todos().every((todo) => todo.completed);
    this.todos(this.todos().map((todo) => ({ ...todo, completed: !isAllCompleted })));
    };

  // 9. 할 일 일괄 삭제 - 완료된 할 일만을 선택적으로 일괄 삭제하는 기능
  완료된할일삭제() {
    this.todos(this.todos().filter((todo) => !todo.completed));
  };

};

ko.applyBindings(new ViewModel());