import Record from 'dataclass';


class TreeNode{
    label: string = ''
    token: string = ''
    children: TreeNode[] = []
}

class Def{
    parse(buf:InputBuffer){

    }
}

class Token extends Def{
    constructor(symbol: string, regexp:RegExp){
        super()
    }
}

class StdNode extends Def{
    constructor(symbol: string, arg: Def[]){
        super()
    }
}

class Choice extends Def{
    constructor(arg: Def[]){
        super()
    }
}

class Repeat extends Def{
    constructor(arg: Def[]){
        super()
    }
}

function token(symbol: string, regexp: RegExp): Token{
    return new Token(symbol, regexp)
}

function exp(symbol: string,...children: Def[]): StdNode{
    return new StdNode(symbol, children)
}

function choice(...choice: Def[]): Choice{
    return new Choice(choice)
}

function repeat(...repeat: Def[]): Repeat{
    return new Repeat(repeat)
}

let number = token('number', /0-9]+/)
let addsub_op = token('addsub_op', /[+\\-]/)
let muldiv_op = token('muldiv_op', /[*/]/)
let muldiv_exp = exp('muldiv_exp', number, repeat(muldiv_op, number))
let addsub_exp = exp('addsub_exp', muldiv_exp, repeat(addsub_op, muldiv_exp))

class InputBuffer{
    ws: RegExp = /[ ]+/
    constructor(inputString: string){

    }
}

class Runner{
    run(root: TreeNode): number{
        return 1
    }
}

function calc(inputString: string){
    let buf = new InputBuffer(inputString)
    let tree = addsub_exp.parse(buf)
}