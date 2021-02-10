//data type
let str: string = 'hello ts';
let num: number = 11;

//array
let strArray: string[] = ['a', 'b', 'c'];
let numArray: Array<number> = [1, 2, 3];


//function
function logInfo(name: string, age: number | string): void {
    console.log(`Info: ${name}, ${age}`);
}

logInfo('Andrei', 25);
logInfo('Andrei', '25');

 
//classes


