const add = function (a, b) {
  return a + b;
};
console.log(add(2, 3));

function runTwice(fun) {
  for (let i = 0; i < 2; i++) {
    fun();
  }
}

const hello = function () {
  console.log("Hello World");
};

runTwice(hello);

function changeText() {
  const p = document.querySelector(".js-button");
  if (p.innerText === "Start") {
    p.innerHTML = "loading...";
    setTimeout(() => {
      p.innerHTML = "Finished";
    }, 1000);
  } else {
    p.innerHTML = "Start";
  }
}


let timeoutId;
function addToCart() {
  
  //const cart = document.querySlector('.js-add');
  const par = document.querySelector(".js-p");
  par.innerHTML = "Item added to cart";

  clearTimeout(timeoutId);

  timeoutId = setTimeout(() => {
    par.innerHTML = "";
  }, 2000);
}

let count = 2;

const minus = () => {
  count--;
  if (count < 0){
    count = 0;
    return;
  }
  message();
}

const plus = () => {
  if ( count >= 0){
    count++;
  }
  
  message(); 
}



function message() {
  if (count === 0) {
    const title = document.querySelector('.js-title');
    title.innerHTML = `App`;
    return;
  } else {
    const title = document.querySelector('.js-title');
    title.innerHTML = `(${count}) messages`;}
  
}


message();
