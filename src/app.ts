let number = new RegExp("[0-9]+");

let operator = new RegExp("[+\\-*/]");

console.log(number);

abstract class Token{
}

class NumberToken extends Token{
    n: string
    constructor(number: string){
        super();
        this.n = number;
    }
}

class Operator extends Token{
    op: string
    constructor(op: string){
        super();
        this.op = op;
    }
}

abstract class AbsNode{
}

class BinaryOperator extends AbsNode{
    l: AbsNode
    op: Operator
    r: AbsNode

    constructor(l: AbsNode, op: Operator, r: AbsNode){
        super();
        this.l = l;
        this.op = op;
        this.r = r;
    }
}

class NumberLiteral extends AbsNode{
    number: NumberToken

    constructor(number: NumberToken){
        super();
        this.number = number; 
    }
}

function wrap_if_match(pattern:RegExp, s: string, wrapper){
    let matched = s.match(pattern);

    if (matched == null){
        return null;
    }
    for(let e of matched.entries()){
        return wrapper(e[1]);
    }
    return null;
}

function tokenize(tokenString: string){
    let a = wrap_if_match(number, tokenString, s => new NumberToken(s)) ;
    if(a !== null)return a;
    let b = wrap_if_match(operator, tokenString, s => new Operator(s));
    if(b !== null)return b
    throw new Error();
}

class Parser{
    tokens: Token[]
    cursor = 0;
    constructor(tokens: Token[]){
        this.tokens = tokens;
    }

    expression(): number{
        let l = this.muldiv_expression();
        while(true){
            let op = this.plusminus_op();
            if(op == null){
                break;
            }
            let r = this.muldiv_expression();
            l = l+r;
        }
        return l;
    }

    muldiv_expression(): number{
        let l = this.number_literal();
        while(true){
            let op =  this.muldiv_op();
            if(op == null){
                break;
            }
            let r = this.number_literal();
            l = l*r;
        }
        return l;
    }

    number_literal(): number{
        if(this.current() instanceof NumberToken){
            let n = this.next() as NumberToken;
            return parseInt(n.n);
        }
        return null;
    }

    plusminus_op(): Operator{
        if(this.current() instanceof Operator){
            let op = (this.current() as Operator).op ;
            if(op == '+' || op == '-'){ 
                return this.next() as Operator;
            }else{
                return null;
            }
        }
    }

    muldiv_op(): Operator{
        if(this.current() instanceof Operator){
            let op = (this.current() as Operator).op ;
            if(op == '*' || op == '/'){ 
                return this.next() as Operator;
            }else{
                return null;
            }
        }
    }

    next(){
        let token = this.current();
        this.cursor += 1;
        return token;
    }

    current(){
        console.log(this.tokens[this.cursor])
        return this.tokens[this.cursor];
    }

    lookahead(){
        return this.tokens[this.cursor+1];
    }
}


function calc(target: string){
    let tokenStrings = target.split(/[ ]*/);
    console.log(tokenStrings);
    let tokens = [];
    for(let i of tokenStrings){
        tokens.push(tokenize(i));
        console.log(tokenize(i));
    }
    let parser = new Parser(tokens);
    console.log(parser.expression());

}

function main(){
    console.log("main");
    let target = "1 + 2 * 3";
    calc(target);
}


main();