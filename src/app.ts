let number = new RegExp("[0-9]+");

let operator = new RegExp("[*+-/]");

console.log(number);

class NumberToken{
    n: string
    constructor(number: string){
        this.n = number;
    }
}

class Operator{
    op: string
    constructor(op: string){
        this.op = op;
    }
}


function tokenize(tokenString: string){
    for(let e of tokenString.match(number).entries()){
        return new NumberToken(e[1])
    }
    for(let e of tokenString.match(operator).entries()){
        return new Operator(e[1])
    }
    throw new Error();
}

function calc(target: string){
    let tokenStrings = target.split(/[ ]*/);
    console.log(tokenStrings);
    for(let i of tokenStrings){
        console.log("A");
        console.log(tokenize(i));
    }
}

function main(){
    console.log("main");
    let target = "1 + 2 * 3";
    calc(target);
}


main();