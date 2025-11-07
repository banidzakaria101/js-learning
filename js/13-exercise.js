const multiply = (a, b) => a * b;

console.log(multiply(2, 3));

const arr = [1, -2, 3, 4, -5];

const positiveNum = (arr) => {
  let i = 0;
  arr.forEach((num) => {
    if (num > 0) {
      i++;
    }
  });
  return i;
};

const num = positiveNum(arr);
console.log(`positive numbers on the araay : ${num}`);

const addNum = (arr, num) => arr.map((n) => n + num);
const arr2 = addNum(arr, 3);
console.log(arr2);

const arrFood = ['egg', 'apple', 'egg', 'banana', 'egg', 'orange', 'mango', 'watermelon', 'egg'];

const removeEgg = (arr) => {
  let count = 0;
  return arr.filter((item) => {
    if (item === 'egg' && count < 2){
      count++;
      return false;
    }
    return true;
  });
}


console.log(removeEgg(arrFood));

