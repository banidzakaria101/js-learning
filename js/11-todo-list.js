const todoList = ["rrr", "eeeee"];
renderTodoList();

function renderTodoList () {
  let todoListHTML = '';
  const paragraphConatainer = document.querySelector(".js-todo-list");
for (const task of todoList) {
  const para = document.createElement("p");
  //para.textContent = task;
  //paragraphConatainer.appendChild(para);
  console.log(task);
  const html = `<p>${task}<p/>`;
  todoListHTML += html;
}

document.querySelector('.js-todo-list').innerHTML = todoListHTML

}

function addTodo() {

  const inputElement = document.querySelector(".todo-input");
  todoList.push(inputElement.value);
  console.log(todoList);
  inputElement.value = "";

  const pElemment = document.querySelector(".p-todo");
  renderTodoList();
}




