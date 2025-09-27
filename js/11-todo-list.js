const todoList = [];


renderTodoList();

function renderTodoList() {
  let todoListHTML = '';
  const paragraphConatainer = document.querySelector(".js-todo-list");
for (let i = 0; i < todoList.length; i++) {
  
  //para.textContent = task;
  //paragraphConatainer.appendChild(para);
  const task = todoList[i];
  const { name, date } = task;
  console.log(task);
  const html = `<div>${name}</div> 
                <div>${date}</div> 
                <button class="delete-button" onClick="todoList.splice(${i}, 1); renderTodoList()">Delete</button>`;
  todoListHTML += html;
}

document.querySelector('.js-todo-list').innerHTML = todoListHTML

}

function addTodo() {

  const nameElement = document.querySelector(".todo-input");
  const dateElement = document.querySelector(".todo-date");
  let taksObject = {
  name: nameElement.value,
  date: dateElement.value,
}
  todoList.push(taksObject);
  console.log(todoList);
  nameElement.value = "";

  const pElemment = document.querySelector(".p-todo");
  renderTodoList();
}




